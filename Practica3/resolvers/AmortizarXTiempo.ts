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
            //console.log(`El cliente ${hipoteca.idCliente} no ha podido pagar su cuota mensual de la hipoteca ${hipoteca._id} por falta de dinero (${cliente.dineroCuenta}-${hipoteca.pagoCuota})`);
            //Error
            return;
        }
        
        const newDineroCuentaCliente = cliente.dineroCuenta - hipoteca.pagoCuota;
        await ClienteModel.findOneAndUpdate({_id: hipoteca.idCliente},{dineroCuenta: newDineroCuentaCliente}).exec()

        if(newCuotas === 0){
            await HipotecaModel.findOneAndDelete().where("_id").equals(hipoteca._id).exec();
            //res.status(200).send(`Enhorabuena, se ha completado el pago de la hipoteca ${idHipoteca}`);
            //console.log(`Hipoteca ${hipoteca._id} completada, enhorabuena`);
            try{
                await GuardarMovimiento(hipoteca.idCliente, String(hipoteca._id), hipoteca.pagoCuota, `Pago de cuota de una hipoteca`)
            }catch(e){
              //gestionar error aqui  
              return;
            }
            return;
        }

        await HipotecaModel.findOneAndUpdate({_id: hipoteca._id},{total: newTotal, cuotas: newCuotas}).exec();
        
        try{
            await GuardarMovimiento(hipoteca.idCliente, String(hipoteca._id), hipoteca.pagoCuota, `Pago de cuota de una hipoteca`)
        }catch(e){
          //gestionar error aqui  
          return;
        }
        //console.log(`Se ha realizado el pago correctamente, a la hipoteca ${hipoteca._id} le quedan ${newCuotas} pagos de ${hipoteca.pagoCuota}$`);
    }))
},0.5*60*1000)
