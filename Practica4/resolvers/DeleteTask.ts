import {Request, Response} from "npm:express@4.18.2"
import { TaskModel } from "../collections/Task.ts"

export const deleteTask = async(req: Request, res: Response) => {
    try{
        const taskId = req.params.id;
        await TaskModel.findOneAndDelete().where("_id").equals(taskId);
        res.status(200).send(`Tarea eliminada`);
    }catch(e){
        res.status(400).send(e.message);
    }
}