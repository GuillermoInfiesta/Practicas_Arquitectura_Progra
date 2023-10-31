import {Response, Request} from 'npm:express@4.18.2';
import {ClientModel, ClientModelType} from '../collections/client.ts';

export const postClient = async (req: Request, res: Response): Promise<void> => {
    const body: Partial<Omit<ClientModelType, "_id">> = req.body;
    const {name, cif} = body;
    if(!name || !cif){
        res.status(303).send("Falta nombre y/o cif");
        return;
    }
    const exists = await ClientModel.findOne({cif}).exec();

    if(exists){
        res.status(303).send("El cliente ya existe en la BBDD");
        return;
    }

    /*
    const newClient = await ClientModel.create({
        name, 
        cif,
    });*/
    await ClientModel.create({
        name, 
        cif,
    });
    res.status(200).send("Cliente añadido");

}