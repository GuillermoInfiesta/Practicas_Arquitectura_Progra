import {Request, Response} from "npm:express@4.18.2"
import { BusinessModel } from '../collections/Business.ts';

export const getAllBusiness = async (req: Request, res: Response) => {
    try{
        const businesses = await BusinessModel.find().populate(['tasks', 'workers']).exec();
        res.status(200).send(businesses);
    }catch(e){
        res.status(400).send(e.message);
    }
}