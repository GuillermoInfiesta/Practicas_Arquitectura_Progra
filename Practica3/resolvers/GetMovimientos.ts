import {Request, Response} from "npm:express@4.18.2"
import { MovimientoModel } from "../collections/Movimiento.ts";

export const GetMovimientos = async(req: Request, res: Response) => {
    const idCliente = req.params.idCliente;

    //Para mostrar los movimientos de un cliente los separaremos en movimientos en los que envia/pierde dinero y movimientos donde gana/recibe dinero
    const dineroEnviado = await MovimientoModel.find().where("idSender").equals(idCliente).exec();
    const dineroRecibido = await MovimientoModel.find().where("idReceiver").equals(idCliente).exec();
    
    res.status(200).send({
        movimientos_envio: dineroEnviado.map((movimiento) => {
            return {
                id: movimiento._id,
                cantidad: movimiento.dinero,
                destinatario: movimiento.idReceiver,
                detalles: movimiento.detalles,
                fecha: movimiento.createdAt
            }
        }),
        movimientos_recibir: dineroRecibido.map((movimiento) => {
            let emisor = movimiento.idSender; 
            if(emisor === ""){
                emisor = "No hay un emisor, ya que es un ingreso"
            }
            return {
                id: movimiento._id,
                cantidad: movimiento.dinero,
                emisor: emisor,
                detalles: movimiento.detalles,
                fecha: movimiento.createdAt
            }
        })
    })
}