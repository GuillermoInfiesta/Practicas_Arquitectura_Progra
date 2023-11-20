import { MovimientoModel } from '../collections/Movimiento.ts';

export const GuardarMovimiento = async(idSender: string, idReceiver: string, dinero: number, detalles: string) => {
    try{
        await MovimientoModel.create({
            idSender: idSender,
            idReceiver: idReceiver,
            dinero: dinero,
            detalles: detalles
        })
    }catch(e){
        throw new Error("No se ha podido guardar el movimiento");
    }
}