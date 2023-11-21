import { HipotecaModel } from '../collections/Hipoteca.ts';
import { ClienteModel } from '../collections/Cliente.ts';
import { GuardarMovimiento } from './GuardarMovimiento.ts';
setInterval(async () => { //medio minuto entre pagos de cuotas
    const hipotecas = await HipotecaModel.find().exec();
    Promise.all(hipotecas.map(async (hipoteca) => {
        const newTotal = hipoteca.total - hipoteca.pagoCuota;
        const newCuotas = hipoteca.cuotas - 1;

        const cliente = await ClienteModel.findById(hipoteca.idCliente).exec();
        
        if(cliente.dineroCuenta < hipoteca.pagoCuota){
            return;
        }
        
        const newDineroCuentaCliente = cliente.dineroCuenta - hipoteca.pagoCuota;
        await ClienteModel.findOneAndUpdate({_id: hipoteca.idCliente},{dineroCuenta: newDineroCuentaCliente}).exec()

        if(newCuotas === 0){
            await HipotecaModel.findOneAndDelete().where("_id").equals(hipoteca._id).exec();
            try{
                await GuardarMovimiento(hipoteca.idCliente, String(hipoteca._id), hipoteca.pagoCuota, `Pago de cuota de una hipoteca`)
            }catch(e){
              return;
            }
            return;
        }

        await HipotecaModel.findOneAndUpdate({_id: hipoteca._id},{total: newTotal, cuotas: newCuotas}).exec();
        
        try{
            await GuardarMovimiento(hipoteca.idCliente, String(hipoteca._id), hipoteca.pagoCuota, `Pago de cuota de una hipoteca`)
        }catch(e){
          return;
        }
    }))
},0.5*60*1000)
