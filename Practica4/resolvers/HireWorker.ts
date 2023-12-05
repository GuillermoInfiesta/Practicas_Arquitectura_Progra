import {Request, Response} from "npm:express@4.18.2"
import { BusinessModel } from "../collections/Business.ts"

export const hireWorker = async(req: Request, res: Response) => {
    try{
        const {id, workerId} = req.params;
        //checkear que no esté ya contratado
        await BusinessModel.findOneAndUpdate({_id: id},{$push: {workers: workerId}}).exec();
        res.status(200).send(`El proceso de contratación se ha llevado a cabo con éxito`);
    }catch(e){
        res.status(400).send(e.message);
    }
}