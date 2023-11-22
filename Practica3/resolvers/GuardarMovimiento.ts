import { MovimientoModel } from '../collections/Movimiento.ts';

//Funcion utilizada para almacenar un movimiento bancario (engreso, envio, pago) en la base de datos
export const GuardarMovimiento = async(idSender: string, idReceiver: string, dinero: number, detalles: string) => {
    try{
        await MovimientoModel.create({
            idSender: idSender,
            idReceiver: idReceiver,
            dinero: dinero,
            detalles: detalles
        })
    }catch(e){
        throw new Error(e.message);
    }
}