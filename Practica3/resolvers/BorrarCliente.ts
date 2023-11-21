import {Request, Response} from "npm:express@4.18.2"
import { ClienteModel } from '../collections/Cliente.ts';
import { GestorModel } from '../collections/Gestor.ts';
import { HipotecaModel } from '../collections/Hipoteca.ts';

export const BorrarCliente = async(req: Request, res: Response) => {
    const idCliente = req.params.id;
    
    const cliente = await ClienteModel.findOne().where("_id").equals(idCliente).exec();

    if(!cliente){
        res.status(404).send(`No se ha encontrado ningun cliente con id ${idCliente}`);
        return;
    }

    const hipotecasCliente = await HipotecaModel.find({idCliente: idCliente}).exec(); //Cogemos todas las hipotecas que corresponden al cliente
    
    //No se puede eliminar un cliente si aun le quedan hipotecas por pagar
    if(hipotecasCliente.length !== 0){
        res.status(400).send(`El cliente aun tiene hipotecas a su nombre, por favor complete sus pagos para poder eliminar el cliente`);
        return;
    }

    const deletedElements = await ClienteModel.deleteOne().where("_id").equals(idCliente).exec();
    if(deletedElements.deletedCount === 0){
        res.status(404).send(`Error al eliminar el cliente`);
        return;
    }

    //Si el cliente tiene gestor lo actualizaremos para indicarle que tiene un cliente menos
    if(cliente.idGestor !== ""){
        const gestor = await GestorModel.findOne().where("_id").equals(cliente.idGestor).exec();
        const newNumeroClientes = gestor.numeroClientes - 1;//aunque sale en rojo, el gestor siempre va a existir por como organizamos el programa y BBDD
        await GestorModel.findOneAndUpdate({_id: cliente.idGestor},{numeroClientes:newNumeroClientes}).exec();
    }    
    
    res.status(200).send(`Cliente eliminado`);
}