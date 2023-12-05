import {Request, Response} from "npm:express@4.18.2"
import { WorkerModel } from "../collections/Worker.ts"

export const getAllWorkers = async(req: Request, res: Response) => {
    try{
        const workers = await WorkerModel.find().populate(['business', 'tasks']).exec();
        res.status(200).send(workers);
    }catch(e){
        res.status(400).send(e.message);
    }
}