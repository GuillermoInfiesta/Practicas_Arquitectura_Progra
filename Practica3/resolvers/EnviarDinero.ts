import {Request, Response} from "npm:express@4.18.2"
import { ClienteModel } from '../collections/Cliente.ts';

export const EnviarDinero = async (req: Request, res: Response) => {
    const idSender = req.params.idSender;
    const idReceiver = req.params.idReceiver;
    const cantidadEnviada = Number(req.params.cantidadEnviada);

    if(idSender === idReceiver){
        res.status(400).send("El cliente se está intentando enviar dinero a si mismo");
        return;
    }

    const sender = await ClienteModel.findOne().where("_id").equals(idSender).exec();
    const receiver = await ClienteModel.findOne().where("_id").equals(idReceiver).exec();

    if(!sender || !receiver){
        res.status(404).send("Uno o ambos clientes no se encuentra en la base de datos");
        return;
    }

    if(cantidadEnviada <= 0){
        res.status(400).send(`La cantidad a enviar no puede ser menor o igual que 0, en tu caso es ${cantidadEnviada}`);
        return;
    }

    const newDineroCuentaSender = sender.dineroCuenta - cantidadEnviada;
    if(newDineroCuentaSender < 0){
        res.status(400).send(`No se puede completar el envio, el sender no cuenta con el dinero suficiente`);
        return;
    }
    const newDineroCuentaReceiver = receiver.dineroCuenta + cantidadEnviada;
    try{
        await ClienteModel.findOneAndUpdate({_id: idSender},{dineroCuenta: newDineroCuentaSender}).exec();
        await ClienteModel.findOneAndUpdate({_id: idReceiver},{dineroCuenta: newDineroCuentaReceiver}).exec();
    }catch(e){
        res.status(400).send(e.message);
        return;
    }
    res.status(200).send(`Se han transferido ${cantidadEnviada}$ del cliente ${idSender} al cliente ${idReceiver}`);
}