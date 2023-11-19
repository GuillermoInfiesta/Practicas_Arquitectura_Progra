import {Request, Response} from "npm:express@4.18.2"
import { GestorModel } from '../collections/Gestor.ts';
import { ClienteModel } from '../collections/Cliente.ts';

export const AsignarGestor = async (req:Request, res:Response) => {
    const idGestor = req.params.idGestor;
    const idCliente = req.params.idCliente;

    const gestor = await GestorModel.findOne().where("_id").equals(idGestor).exec();
    const cliente = await ClienteModel.findOne().where("_id").equals(idCliente).exec();
    
    if(!gestor){
        res.status(404).send(`No existe ningun gestor con id ${idGestor}`);
        return;
    }
    
    if(!cliente){
        res.status(404).send(`No existe ningun cliente con id ${idCliente}`);
        return;
    }

    if(gestor.numeroClientes === 10){
        res.status(400).send(`El gestor ${idGestor} ya ha alcanzado su limite de clientes`);
        return;
    }

    if(cliente.idGestor !== ""){
        res.status(400).send(`El cliente ${idCliente} ya tiene un gestor y no se puede cambiar`);
        return;
    }

    try{
        const newNumeroClientes = gestor.numeroClientes + 1;
        await GestorModel.findOneAndUpdate({_id: idGestor}, {numeroClientes: newNumeroClientes}).exec();
        await ClienteModel.findOneAndUpdate({_id: idCliente},{idGestor: idGestor}).exec();
    }catch(e){
        res.status(400).send(e.message);
        return;
    }

    res.status(200).send("Cliente y gestor actualizados");
}