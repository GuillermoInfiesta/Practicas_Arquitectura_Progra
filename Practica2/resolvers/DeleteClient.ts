import {Response, Request} from 'npm:express@4.18.2';
import {ClientModel} from "../collections/client.ts";
import { checkIdLength } from '../verifiers/checkIdLength.ts';

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    
    try{
        checkIdLength(id);
    }catch(e){
        res.status(400).send(e.message);
        return;
    }

    const deleted = await ClientModel.deleteOne().where("_id").equals(id).exec();

    if(deleted.deletedCount == 0){
        res.status(404).send("Error 404: Cliente no econtrado");
        return;
    }

    res.status(200).send("Cliente elimiado");
}