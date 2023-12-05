import {Request, Response} from "npm:express@4.18.2"
import { TaskModel } from "../collections/Task.ts"

export const getTask = async(req: Request, res: Response) => {
    try{
        const task = await TaskModel.findById(req.params.id).populate(['worker', 'business']).exec();
        
        if(!task) res.status(404).send(`No se ha encontrado ninguna tarea con id ${req.params.id}`)

        res.status(200).send(task);
    }catch(e){
        res.status(400).send(e.message);
    }
}