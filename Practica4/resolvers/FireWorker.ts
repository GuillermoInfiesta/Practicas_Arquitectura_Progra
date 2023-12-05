import {Request, Response} from "npm:express@4.18.2"
import { BusinessModel } from "../collections/Business.ts"

export const fireWorker = async(req: Request, res: Response) => {
    try{
        const {id, workerId} = req.params;
        //Creo funciona para ahi decirle que el campo nuevo es el array sin este??
        //$pull para sacar del array
        await BusinessModel.findOneAndUpdate({_id: id},{$pull: {workers: workerId}}).exec();
        res.status(200).send(`El proceso de despido se ha llevado a cabo con éxito`);
    }catch(e){
        res.status(400).send(e.message);
    }
} 