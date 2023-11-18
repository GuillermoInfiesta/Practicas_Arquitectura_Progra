import {Request, Response} from "npm:express@4.18.2"
import { HipotecaModelType } from "../collections/Hipoteca.ts";
import { ClienteModel } from '../collections/Cliente.ts';
import { HipotecaModel } from '../collections/Hipoteca.ts';

export const CrearHipoteca = async (req: Request, res: Response) => {
    const body: Partial<Omit<HipotecaModelType,"_id">> = req.body;
    const {total, idCliente, idGestor} = body; //Para optimizar no recibir idGestor y mirarlo en el cliente directamente

    if(!total || !idCliente || !idGestor){
        res.status(400).send("Faltan parámetros, se necesita total, un cliente y un gestor");
        return;
    }

    if(total > 1000000){
        res.status(400).send(`La cantidad total de la hipoteca no puede superar el millon, en tu caso es ${total}`);
        return;
    }

    const cliente = await ClienteModel.findOne().where("_id").equals(idCliente).exec();

    if(!cliente){
        res.status(404).send("El cliente no existe");
        return;
    }

    if(cliente.idGestor !== idGestor){
        res.status(400).send("Este gestor no coincide con el del cliente");
        return;
    }

    await HipotecaModel.create({
            total,
            cuotas: 20,
            idCliente,
            idGestor,
            pagoCuota: total/20
    });

    res.status(200).send("Se ha creado la hipoteca");
    
}