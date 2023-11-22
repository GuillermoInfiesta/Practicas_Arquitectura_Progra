import { ClienteModel } from '../collections/Cliente.ts';
import { GuardarMovimiento } from './GuardarMovimiento.ts';

setInterval(async () => { //medio minuto entre ingresos
    const clientes = await ClienteModel.find().exec();
    Promise.all(clientes.map(async (cliente) => {
        const newDineroCuenta = cliente.dineroCuenta + 10000;
        await ClienteModel.findOneAndUpdate({_id: cliente._id},{dineroCuenta: newDineroCuenta}).exec();
        try{
            await GuardarMovimiento("",String(cliente._id),10000,`Ingreso`)
        }catch(e){
            return;
        }        
    }))
},5*60*1000)
