import {Request, Response} from "npm:express@4.18.2"
import { TaskModel } from "../collections/Task.ts"

export const postTask = async(req: Request, res: Response) => {
    try{
        const {status, worker, business, descripcion} = req.body;
        await TaskModel.create({
            status,
            worker,
            business,
            descripcion
        })
        res.status(200).send(`Tarea añadida a la base de datos`)
    }catch(e){
        res.status(400).send(e.message);
    }
}