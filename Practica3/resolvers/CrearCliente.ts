import {Request, Response} from "npm:express@4.18.2"
import { ClienteModel, ClienteModelType } from "../collections/Cliente.ts"
import { GestorModel } from '../collections/Gestor.ts';

export const CrearCliente = async (req: Request, res: Response) => {
    const body: Partial<Omit<ClienteModelType,"_id">> = req.body;
    const {nombre, dni, correo, telefono, dineroCuenta, idGestor} = body;

    if(!nombre || !dni || !correo || !telefono){
        res.status(400).send("Falatn datos necesarios sobre el cliente");
        return;
    }

    /*
    const exists = await ClienteModel.findOne().where("dni").equals(dni).exec();
    if(exists){
        res.send(400).send(`El cliente de dni ${dni} ya existe`);
        return;
    }

    if(dineroCuenta && dineroCuenta < 0){
        res.status(400).send(`El dinero en la cuenta no puede ser negativo, en este caso es ${dineroCuenta}`)
        return;
    }

    if(idGestor){
        const gestor = await GestorModel.findOne().where("_id").equals(idGestor).exec();
        if(!gestor){
            res.status(404).send(`El gestor de id ${idGestor} no está registrado en la base de datos`);
            return;
        }
        if(gestor.numeroClientes === 10){
            res.status(400).send(`El gestor ya ha alcanzado su maximo número posible de clientes`);
            return;
        }
    }
    */
   try{
        /*const newCliente =*/ await ClienteModel.create({
            nombre, 
            dni,
            correo,
            telefono,
            dineroCuenta,
            idGestor
        })
    
        /*if(idGestor){ Si quiero poder crear cliente con gestor directamente desmutear y tocar aqui
            const gestor = await GestorModel.findOne().where("_id").equals(idGestor).exec();
            //Ya se que el gestor existe porque sino hubiera dado error y no llegariamos asta aqui
            const newIdClientes = gestor.idClientes;
            newIdClientes.push(String(newCliente._id));
            const newNumeroClientes = gestor.numeroClientes+1;
    
            GestorModel.findOneAndUpdate({_id:idGestor},{idClientes: newIdClientes, numeroClientes: newNumeroClientes }).exec();
        }*/
    
        res.status(200).send("Cliente creado y gestor actualizado (en caso de tener)")
    

    }catch(e){
        res.status(400).send(e.message);
        return;
    }

}