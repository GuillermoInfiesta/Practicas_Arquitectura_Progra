import {Request, Response} from "npm:express@4.18.2"
import { ClienteModel } from "../collections/Cliente.ts";

export const GetAllClientes = async(req: Request, res: Response) => {
    const clientes = await ClienteModel.find().exec();

    //De todos los clientes damos solo estos datos, si se quiere ver mas en profundidad buscar el cliente por id
    res.status(200).send(clientes.map((cliente) => { 
        return{
            id: cliente._id,
            nombre: cliente.nombre,
            idGestor: cliente.idGestor,
            dinero: cliente.dineroCuenta
        }
    }))
}