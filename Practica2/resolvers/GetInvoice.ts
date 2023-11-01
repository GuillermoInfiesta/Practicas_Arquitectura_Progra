import { Request, Response } from 'npm:express@4.18.2';
import { InvoiceModel } from '../collections/invoice.ts';
import { checkIdLength } from '../verifiers/checkIdLength.ts';
import { ClientModel } from '../collections/client.ts';
import { ProductModel } from '../collections/product.ts';
 
//Creo este tipo para devolver los nombres de las cosas en vez de los _id, asi es mucho más comprensible para el usuario
type Ret = {
    cliName:string,
    prodsName:string[],
    total:number
}

export const getInvoice = async (req: Request, res: Response) => {
    const id = req.params.id;

    try{
        checkIdLength(id);
    }catch(e){
        res.status(400).send(e.message);
        return;
    }

    const exists = await InvoiceModel.findOne().where("_id").equals(id).exec();
    if(!exists){
        res.status(404).send("No existe esa factura");
        return;
    }


    const client = await ClientModel.findOne().where("_id").equals(exists.idCliente).exec();
    if(!client){
        res.status(404).send("Cliente no encontrado");
        return;
    }
    const cliName = client?.name;

    
    let prodNames : string[] = [];
    for(const id of exists.products){
        const prod = await ProductModel.findOne().where("_id").equals(id).exec();
        if(!prod){
            res.status(404).send(`Producto ${id} no encontrado`);
            return;
        }
        prodNames.push(prod.name) 
    }

    const data: Ret = {
        cliName: cliName,
        prodsName: prodNames,
        total: exists.total,
    }

    res.status(200).send(data);
    
}