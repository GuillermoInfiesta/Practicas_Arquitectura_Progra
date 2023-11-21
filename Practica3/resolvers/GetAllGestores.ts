import {Request, Response} from "npm:express@4.18.2"
import { GestorModel } from "../collections/Gestor.ts";

export const GetAllGestores = async(req: Request, res: Response) => {
    const gestores = await GestorModel.find().exec();
    
    //De todos los gestores damos solo estos datos, si se quiere ver mas en profundidas buscar el gestor por id
    res.status(200).send(gestores.map((gestor) => {
        return{
            id: gestor._id,
            nombre: gestor.nombre,
            numeroClientes: gestor.numeroClientes
        }
    }))

}