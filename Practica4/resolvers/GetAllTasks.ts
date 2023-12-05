import {Request, Response} from "npm:express@4.18.2"
import { TaskModel } from "../collections/Task.ts"

export const getAllTasks = async(req: Request, res: Response) => {
    try{
        const tasks = await TaskModel.find().populate(['worker', 'business']).exec();
        res.status(200).send(tasks);
    }catch(e){
        res.status(400).send(e.message);
    }
}