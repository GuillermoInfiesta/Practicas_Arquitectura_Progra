import {Request, Response} from "npm:express@4.18.2"
import { BusinessModel } from "../collections/Business.ts"

export const postBusiness = async(req: Request, res: Response) => {
    try{
        const {name, workers} = req.body;
        await BusinessModel.create({
            name,
            workers
        })
            res.status(200).send(`Empresa añadida a la base de datos`);
    }catch(e){
        res.status(400).send(e.message)
    }
}