import {Request, Response} from "npm:express@4.18.2"
import { ClienteModel } from '../collections/Cliente.ts';
import { GestorModel } from '../collections/Gestor.ts';

export const BorrarCliente = async(req: Request, res: Response) => {
    const idCliente = req.params.id;
    const cliente = await ClienteModel.findOne().where("_id").equals(idCliente).exec();
    const deletedElements = await ClienteModel.deleteOne().where("_id").equals(idCliente).exec();

    if(deletedElements.deletedCount === 0){
        res.status(404).send(`No se ha encontrado ningun cliente con id ${idCliente}`);
        return;
    }

    if(cliente.idGestor !== ""){
        const gestor = await GestorModel.findOne().where("_id").equals(cliente.idGestor).exec();
        const newIdClientes = gestor.idClientes;
        newIdClientes.splice(newIdClientes.indexOf(idCliente),1);
        const newNumeroClientes = gestor.numeroClientes-1;
        await GestorModel.findOneAndUpdate({_id: cliente.idGestor},{idClientes: newIdClientes, numeroClientes:newNumeroClientes}).exec();
    }
    
    res.status(200).send(`Cliente eliminado y gestor actualizado (en caso de que tuviera)`);
}