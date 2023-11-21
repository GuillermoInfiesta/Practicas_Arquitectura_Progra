import {Request, Response} from "npm:express@4.18.2"
import { ClienteModel } from "../collections/Cliente.ts";
import { HipotecaModel } from "../collections/Hipoteca.ts";

export const GetCliente = async(req: Request, res: Response) => {
    const id = req.params.id;
    const cliente = await ClienteModel.findById(id).exec();
    if(!cliente){
        res.status(404).send(`No se encuentra ningun cliente con id ${id}`);
        return;
    }
    const hipotecas = await HipotecaModel.find().where("idCliente").equals(id).exec();
    
    res.status(200).send({
        datos_cliente: cliente,
        hipotecas_cliente: hipotecas
    })
}