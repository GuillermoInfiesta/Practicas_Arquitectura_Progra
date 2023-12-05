import {Request, Response} from "npm:express@4.18.2"
import { WorkerModel } from "../collections/Worker.ts"

export const postWorker = async(req: Request, res: Response) => {
    try{
        const {dni, business} = req.body;
        await WorkerModel.create({
            dni,
            business
        });
        res.status(200).send(`Trabajador añadido a la base de datos`);
    }catch(e){
        res.status(400).send(e.message);
    }
}