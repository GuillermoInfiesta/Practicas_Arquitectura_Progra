import {Request, Response} from "npm:express@4.18.2"
import { HipotecaModel } from '../collections/Hipoteca.ts';

export const GetAllHipotecas = async(req: Request, res: Response) => {
    const hipotecas = await HipotecaModel.find().exec();
    res.status(200).send(hipotecas.map((hipoteca) => {
        return{
            id: hipoteca._id,
            idCliente: hipoteca.idCliente,
            total_restante: hipoteca.total,
            cuotas_restantes: hipoteca.cuotas
        }
    }))
}