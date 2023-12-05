import {Request, Response} from "npm:express@4.18.2"
import { WorkerModel } from "../collections/Worker.ts"

export const getWorker = async(req: Request, res: Response) => {
    try{
        const worker = await WorkerModel.findById(req.params.id).populate('business', 'tasks').exec();
        
        if(!worker) res.status(404).send(`No se ha encontrado ningun trabajador con id ${req.params.id}`)
        
        res.status(200).send(worker);
    }catch(e){
        res.status(400).send(e.message);
    }
}