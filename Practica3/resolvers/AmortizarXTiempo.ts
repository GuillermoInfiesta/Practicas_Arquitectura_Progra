import { HipotecaModel } from '../collections/Hipoteca.ts';
import { ClienteModel } from '../collections/Cliente.ts';
import { GuardarMovimiento } from './GuardarMovimiento.ts';

//Utilizamos setInterval para ejecutar la funcion que declaramos aqui cada x tiempo
setInterval(async () => {
    const hipotecas = await HipotecaModel.find().exec();

    //Se utiliza map ya que es uno de los metodos paralelos que puede utilizar async
    Promise.all(hipotecas.map(async (hipoteca) => {
        const newTotal = hipoteca.total - hipoteca.pagoCuota;
        const newCuotas = hipoteca.cuotas - 1;

        const cliente = await ClienteModel.findById(hipoteca.idCliente).exec();
        
        //Si el cliente no puede pagar detenemos la amortización
        if(cliente.dineroCuenta < hipoteca.pagoCuota){ 
            return;
        }
        
        const newDineroCuentaCliente = cliente.dineroCuenta - hipoteca.pagoCuota;
        await ClienteModel.findOneAndUpdate({_id: hipoteca.idCliente},{dineroCuenta: newDineroCuentaCliente}).exec()

        //Si esta era la ultima cuota eliminamos la hipoteca
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
},5*60*1000) 
