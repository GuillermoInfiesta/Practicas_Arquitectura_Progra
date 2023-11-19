import {Request, Response} from "npm:express@4.18.2"
import { GestorModel, GestorModelType } from "../collections/Gestor.ts"
import { ClienteModel } from '../collections/Cliente.ts';

/*const checkClient = async(id:string) => {
    const exists = await ClienteModel.findOne().where("_id").equals(id).exec();
    if(!exists || exists.idGestor !== ""){
        console.log(id);
        missingClient = true;
    }
}

let missingClient = false;*/

export const CrearGestor = async(req: Request, res: Response) => {
    const body: Partial<Omit<GestorModelType,"_id">> = req.body;
    const {nombre, dni, /*idClientes, numeroClientes*/} = body;

    if(!nombre || !dni){
        res.status(400).send("Faltan datos necesarios sobre el gestor");
        return;
    }
    /*
    if(await GestorModel.findOne().where("dni").equals(dni).exec()){
        res.status(400).send(`Ya existe un gestor con dni ${dni}`);
        return;
    }
    */

    /*
    if(numeroClientes && (numeroClientes >=10 || numeroClientes <0 )){
        res.status(400).send(`El numero de clientes debe estar entre 0 y 10, en tu caso vale ${numeroClientes}`);
        return;
    }

    if(idClientes){
        if(idClientes.length>10){
            res.status(400).send(`Un gestor no puede estar a cargo de mas de 10 clientes`)
        }
        if(numeroClientes && idClientes.length !== numeroClientes){
            res.status(400).send(`La cantidad de clientes y el numero no coincide, dices que tienes ${numeroClientes} clientes, pero en el array hay ${idClientes.length} id`);
            return;
        }


        const allStrings = idClientes.every((id)=>{typeof id === "string"});
        if(!allStrings){
            res.status(400).send("Los id en el array deben de ser todos de tipo string");
            return;
        }


        await Promise.all(idClientes.map(async (id) => {
            await checkClient(id);
        }))

        if(missingClient){
            missingClient = false;
            res.status(400).send("Alguno/s de los clientes no existe o ya tiene gestor");
            return;
        }
    }else if(numeroClientes && numeroClientes !== 0){
        res.status(400).send(`No introduces un array de clientes por lo que el numero de clientes deberia ser 0, pero le has asignado ${numeroClientes}`);
        return;
    }
    */
    /*const newGestor = */await GestorModel.create({
        nombre: nombre,
        dni: dni,
        //idClientes: idClientes,
        //numeroClientes: numeroClientes
        numeroClientes: 0
    });

    /*const idGestor = newGestor._id;
    //if(newGestor.numeroClientes > 0){
        await Promise.all(newGestor.idClientes.map(async(id) => { 
            await ClienteModel.findOneAndUpdate({_id: id},{idGestor: idGestor}).exec();
        }))                                     
    //}*/

    res.status(200).send("Gestor creado");
    //res.status(200).send("Gestor creado y vinculado a sus clientes (en caso de tener)");
}