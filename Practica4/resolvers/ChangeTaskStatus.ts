import {Request, Response} from "npm:express@4.18.2"
import { TaskModel } from "../collections/Task.ts"

export const changeStatus = async(req: Request, res: Response) => {
    try{
        const id = req.params.id;
        const url = new URL(req);
        //console.log(url);
        //console.log(url.searchParams);
        const status = url.searchParams.get("status");
        await TaskModel.findOneAndUpdate({_id: id}, {status: status}).exec();
        res.status(200).send(`Status actualizado`);

    }catch(e){
        res.status(400).send(e.message)
    }

}