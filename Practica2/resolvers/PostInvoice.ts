import {Request, Response} from 'npm:express@4.18.2';
import { InvoiceModel, InvoiceModelType } from "../collections/invoice.ts";
import { ClientModel } from '../collections/client.ts';
import { ProductModel } from '../collections/product.ts';
import { checkIdLength } from '../verifiers/checkIdLength.ts';


export const postInvoice = async (req: Request, res: Response) => {
    const body: Partial<Omit<InvoiceModelType, "_id">> = req.body;
    const {idCliente, products, total} = body;

    if(!idCliente || !products || !total){
        res.status(404).send("Faltan datos");
        return;
    }

    try{
        //Comprobar que exista el cliente
        checkIdLength(idCliente);
        const cliExist = await ClientModel.findOne().where("_id").equals(idCliente).exec();
        if(!cliExist)
            throw new Error ("El cliente no existe");

        console.log("Cliente Ok")

        //Comprobar que existan los productos
        for(const elem of products){ //Uso un for para comprobar porque desde el foreach (mi idea inicial) no puedo
                                     //lanzar errores ya que no los puedo coger con el catch que envuelve al foreach
            checkIdLength(elem);
            const prodExists = await ProductModel.findOne().where("_id").equals(elem).exec();
            if(!prodExists){
                throw new Error (`El producto: ${elem} no existe`);
            }
        }
        console.log("Productos Ok");

        //Comprobamos que la suma de price y el total cuadren, en el map devolvemos un array de Promise<precio del item>
        const productsPrices = products.map(async (x):Promise<number> => {
            const priceOfProd = await ProductModel.findOne().where("_id").equals(x).exec();
            return priceOfProd.price;
        });
        //Usamos el array de promesas creado arriba y con un reduce devolvemos a totalPrice la suma total de precios
        const totalPrice = await productsPrices.reduce(async (accumPromise, actPrice) => {
            const accumPrice = await accumPromise; // Esperar a que termine la anterior invoice
            const value = await actPrice;
            const num = value ?? 0;
            return accumPrice + num;
          }, Promise.resolve(0));         

        //Comparamos el total que nos da el usuario al intentar post y el total real
        if(total !== totalPrice){
            throw new Error (`El total no coincice, debería ser ${totalPrice}$, no ${total}$`);
        }
        console.log("Total ok");

        const newInvoice = await InvoiceModel.create({
            idCliente: idCliente,
            products: products,
            total: total
        });

        res.status(200).send(`Invoice creada, id: ${newInvoice._id}`);
    }
    catch(e){
        res.status(404).send(e.message);
        return;
    }
   
}                               