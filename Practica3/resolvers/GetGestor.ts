import {Request, Response} from "npm:express@4.18.2"
import { GestorModel } from "../collections/Gestor.ts";
import { ClienteModel } from "../collections/Cliente.ts";

export const GetGestor = async(req: Request, res: Response) => {
    const id = req.params.id;
    const gestor = await GestorModel.findById(id).exec();
    if(!gestor){
        res.status(404).send(`No se encuentra ningun gestor con id ${id}`);
        return;
    }
    const clientes = await ClienteModel.find().where("idGestor").equals(id).exec();
    res.status(200).send({
        datos_gestor: gestor,
        clientes_gestor: clientes.map((cliente) => {
            return {
                id: cliente._id,
                nombre: cliente.nombre,
                dni: cliente.dni
            };
        })
    })
}