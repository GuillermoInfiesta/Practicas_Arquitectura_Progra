import {Request, Response} from "npm:express@4.18.2"
import { BusinessModel } from "../collections/Business.ts"

export const deleteBusiness = async(req: Request, res: Response) => {
    try{
        await BusinessModel.findOneAndDelete().where("_id").equals(req.params.id);
        res.status(200).send(`Empresa eliminada`);
    }catch(e){
        res.status(400).send(e.message);
    }
}