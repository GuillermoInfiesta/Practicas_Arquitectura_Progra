import {Request, Response} from "npm:express@4.18.2"
import { WorkerModel } from "../collections/Worker.ts";

export const deleteWorker = async(req: Request, res: Response) => {
    try{
        await WorkerModel.findOneAndDelete().where("_id").equals(req.params.id);
        res.status(200).send(`Trabajador eliminado`);
    }catch(e){
        res.status(400).send(e.message);
    }
}