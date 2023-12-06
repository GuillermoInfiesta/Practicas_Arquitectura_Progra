import {Request, Response} from "npm:express@4.18.2"
import { BusinessModel } from "../collections/Business.ts"

export const postBusiness = async(req: Request, res: Response) => {
    try{
        const {name, workers} = req.body;
        await BusinessModel.create({ //No se crea con tareas porque las tareas en mi caso necesitan tanto trabajador como empresa y si uno se elimina se borra la tarea por completo. asique no puede darse el
            name,                    //caso de tener una tarea sin empresa que podamos poner aqui
            workers
        })
            res.status(200).send(`Empresa añadida a la base de datos`);
    }catch(e){
        res.status(400).send(e.message)
    }
}