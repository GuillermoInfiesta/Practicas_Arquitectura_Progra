import {Request, Response} from "npm:express@4.18.2"
import { BusinessModel } from '../collections/Business.ts';

export const getBusiness = async (req: Request, res: Response) => {
    try{
        const business = await BusinessModel.findById(req.params.id).populate(['tasks', 'workers']).exec();

        if(!business) res.status(404).send(`No se ha encontrado ninguna empresa con id ${req.params.id}`);

        res.status(200).send(business);
    }catch(e){
        res.status(400).send(e.message);
    }
}