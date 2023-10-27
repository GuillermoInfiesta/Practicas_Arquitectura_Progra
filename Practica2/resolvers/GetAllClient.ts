import {Request, Response} from 'npm:express@4.18.2';
import { ClientModel } from "../collections/client.ts";

export const getAllClients = async (req: Request, res: Response): Promise<void> => {
    //Comprobar si el modelo existe
    if(!ClientModel.exists){
        res.status(404).send("No existe un almacen de clientes")
    }
    const clientes = await ClientModel.find({}).exec();

    if(clientes.length < 1){
        res.status(404).send("No hay ningun cliente");
        return;
    }

    res.status(200).send(clientes);
}