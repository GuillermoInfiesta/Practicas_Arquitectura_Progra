import {Request, Response} from "npm:express@4.18.2"
import { ClienteModel, ClienteModelType } from "../collections/Cliente.ts"

export const CrearCliente = async (req: Request, res: Response) => {
    const body: Partial<Omit<ClienteModelType,"_id">> = req.body;
    const {nombre, dni, correo, telefono, dineroCuenta} = body;

    if(!nombre || !dni || !correo || !telefono){
        res.status(400).send("Falatn datos necesarios sobre el cliente");
        return;
    }

   try{
        await ClienteModel.create({
            nombre, 
            dni,
            correo,
            telefono,
            dineroCuenta
        })
        res.status(200).send("Cliente creado")
    }catch(e){
        res.status(400).send(e.message);
        return;
    }

}