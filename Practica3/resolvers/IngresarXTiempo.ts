import { ClienteModel } from '../collections/Cliente.ts';
import { GuardarMovimiento } from './GuardarMovimiento.ts';

setInterval(async () => { //medio minuto entre ingresos
    const clientes = await ClienteModel.find().exec();
    Promise.all(clientes.map(async (cliente) => {
        const newDineroCuenta = cliente.dineroCuenta + 10000;
        await ClienteModel.findOneAndUpdate({_id: cliente._id},{dineroCuenta: newDineroCuenta}).exec();
        //Añadir mensaje de que se realizó el envio o guardar historial de pagos/movimientos
        //console.log(`Pago de 10k a ${cliente._id}`);
        try{
            await GuardarMovimiento("",String(cliente._id),10000,`Ingreso de dinero`)
        }catch(e){
            return;
        }
        
    }))
},0.5*60*1000)
