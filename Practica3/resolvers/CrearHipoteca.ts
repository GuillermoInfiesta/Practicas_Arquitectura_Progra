import {Request, Response} from "npm:express@4.18.2"
import { HipotecaModelType } from "../collections/Hipoteca.ts";
import { ClienteModel } from '../collections/Cliente.ts';
import { HipotecaModel } from '../collections/Hipoteca.ts';

export const CrearHipoteca = async (req: Request, res: Response) => {
    const body: Partial<Omit<HipotecaModelType,"_id">> = req.body;
    const {total, idCliente} = body; //Para optimizar no recibir idGestor y mirarlo en el cliente directamente

    if(!total || !idCliente){
        res.status(400).send("Faltan parámetros, se necesita total, un cliente y un gestor");
        return;
    }

    /*
    if(total > 1000000){
        res.status(400).send(`La cantidad total de la hipoteca no puede superar el millon, en tu caso es ${total}`);
        return;
    }

    const cliente = await ClienteModel.findOne().where("_id").equals(idCliente).exec();

    if(!cliente){
        res.status(404).send("El cliente no existe");
        return;
    }
    
    if(cliente.idGestor === ""){
        res.status(400).send("El cliente necesita un gestor para poder tener una hipoteca");
        return;
    }*/

    try{
        await HipotecaModel.create({
                total,
                cuotas: 20,
                idCliente,
                pagoCuota: total/20
        });
        res.status(200).send("Se ha creado la hipoteca");
    }catch(e){
        res.status(400).send(e.message);
        return;
    }
}