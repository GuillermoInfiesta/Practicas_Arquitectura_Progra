import {Request, Response} from "npm:express@4.18.2"
import { GestorModel, GestorModelType } from "../collections/Gestor.ts"

export const CrearGestor = async(req: Request, res: Response) => {
    const body: Partial<Omit<GestorModelType,"_id">> = req.body;
    const {nombre, dni} = body;

    if(!nombre || !dni){
        res.status(400).send("Faltan datos necesarios sobre el gestor");
        return;
    }

    try{
        await GestorModel.create({
            nombre: nombre,
            dni: dni,
            numeroClientes: 0 //Los gestores se crean sin clientes
        });
    }catch(e){
        res.status(400).send(e.message);
        return;
    } 

    res.status(200).send("Gestor creado");
}