import { Request, Response } from 'npm:express@4.18.2';
import { InvoiceModel } from '../collections/invoice.ts';

export const getInvoice = async (req: Request, res: Response) => {
    const id = req.params.id;
    const exists = await InvoiceModel.findOne().where("_id").equals(id).exec();
    if(!exists){
        res.status(404).send("No existe esa factura");
        return;
    }
    //Ahora mismo muestra los id de las cosas, cambiar para que use los id para coger los objetos en si
    res.status(200).send(exists);
}