import {Request, Response} from "npm:express@4.18.2"
import { WorkerModel } from "../collections/Worker.ts"

export const postWorker = async(req: Request, res: Response) => {
    try{
        const {name, dni} = req.body;
        
        //El trabajador se crea sin empresa y sin tarea porque, para empresa, ya tenemos el metodo hire para contratarlo, y en cuanto a tareas, estas en mi caso necesitan tanto trabajador como empresa para
        //existir, por lo que no se va a dar un caso donde haya tarea sin trabajador.

        await WorkerModel.create({
            name,
            dni
        });
        res.status(200).send(`Trabajador añadido a la base de datos`);
    }catch(e){
        res.status(400).send(e.message);
    }
}