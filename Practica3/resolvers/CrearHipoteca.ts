import {Request, Response} from "npm:express@4.18.2"
import { HipotecaModelType } from "../collections/Hipoteca.ts";
import { HipotecaModel } from '../collections/Hipoteca.ts';

export const CrearHipoteca = async (req: Request, res: Response) => {
    const body: Partial<Omit<HipotecaModelType,"_id">> = req.body;
    const {total, idCliente} = body;

    if(!total || !idCliente){
        res.status(400).send("Faltan parámetros, se necesita total, un cliente y un gestor");
        return;
    }

    try{
        await HipotecaModel.create({
                total,
                cuotas: 20, //Las cuotas siempre inician como 20
                idCliente,
                pagoCuota: total/20 
        });
        res.status(200).send("Se ha creado la hipoteca");
    }catch(e){
        res.status(400).send(e.message);
        return;
    }
}