import {Request, Response} from "npm:express@4.18.2"
import { ClienteModel } from '../collections/Cliente.ts';
import { GuardarMovimiento } from './GuardarMovimiento.ts';

export const IngresarDinero = async(req: Request, res: Response) => {
    const id = req.params.id;
    const cantidadIngresada = Number(req.params.cantidadIngresada);

    const cliente = await ClienteModel.findOne().where("_id").equals(id).exec();
    if(!cliente){
        res.status(404).send(`No se ha encontrado ningun cliente con id ${id}`);
        return;
    }
    if(cantidadIngresada <= 0){
        res.status(400).send(`La cantidad a ingresar no puede ser menor o igual que 0, en tu caso es ${cantidadIngresada}`);
        return;
    }

    const newDineroCuenta = cliente.dineroCuenta + cantidadIngresada;

    await ClienteModel.findOneAndUpdate({_id: id}, {dineroCuenta: newDineroCuenta}).exec();

    try{
        await GuardarMovimiento("",id,cantidadIngresada,`Ingreso de dinero`);
    }catch(e){
        res.status(400).send(e.message);
        return;
    }
    
    res.status(200).send(`Se han añadido ${cantidadIngresada}$ al cliente ${id}`);
}