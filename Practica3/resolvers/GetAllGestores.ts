import {Request, Response} from "npm:express@4.18.2"
import { GestorModel } from "../collections/Gestor.ts";

export const GetAllGestores = async(req: Request, res: Response) => {
    const gestores = await GestorModel.find().exec();
    res.status(200).send(gestores.map((gestor) => {
        return{
            id: gestor._id,
            nombre: gestor.nombre,
            numeroClientes: gestor.numeroClientes
        }
    }))

}