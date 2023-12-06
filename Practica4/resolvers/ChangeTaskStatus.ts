import {Request, Response} from "npm:express@4.18.2"
import { TaskModel } from "../collections/Task.ts"

export const changeStatus = async(req: Request, res: Response) => {
    try{
        const id = req.params.id;
        const status = req.query.status;

        await TaskModel.findOneAndUpdate({_id: id}, {status: status}).exec();
        res.status(200).send(`Status actualizado`);

    }catch(e){
        res.status(400).send(e.message)
    }

}