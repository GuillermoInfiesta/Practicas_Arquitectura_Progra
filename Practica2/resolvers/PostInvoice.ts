import {Request, Response} from 'npm:express@4.18.2';
import { InvoiceModel, InvoiceModelType } from "../collections/invoice.ts";
import { ClientModel } from '../collections/client.ts';
import { ProductModel } from '../collections/product.ts';

export const postInvoice = async (req: Request, res: Response) => {
    const body: Partial<Omit<InvoiceModelType, "_id">> = req.body;
    const {idCliente, products, total} = body;

    if(!idCliente || !products || !total){
        res.status(404).send("Faltan datos");
        return;
    }

    try{
        //comprobar si existe todo
        const cliExist = await ClientModel.findOne({idCliente}).exec();
        console.log(cliExist?.cif)
        if(!cliExist)
            throw new Error ("El cliente no existe");

        products.forEach(async (x)=>{
            console.log(x);
            const prodExists = await ProductModel.findOne({x}).exec();
            console.log(prodExists);

            if(!prodExists)
                throw new Error (`El producto: ${x} no existe`);
        });
        console.log("Cliente ok");

        const productsPrices = products.map(async (x):Promise<number> => {
            const priceOfProd = await ProductModel.findOne({x}).exec();
            return priceOfProd?.price ?? 0 ;
        });
        console.log("Productos Ok");

        const totalPrice = productsPrices.reduce((accumPrice, actPrice) => {
            let num = 0;
            actPrice.then((value) => {num = value}); //no se guarda el cambio
            console.log(num);
            return accumPrice + (num ?? 0);
        },0); 

        /*
        const totalPrice: number = products?.map(async (x):Promise<number> => {
                                        const priceOfProd = await ProductModel.findOne(x).exec();
                                        return priceOfProd?.price ?? 0;
                                    }).reduce((accPrice, actPrice) => {
                                        const suma = actPrice.then((value => {
                                            return accPrice+value;
                                        }))
                                        return suma;
                                        //return accPrice + Promise.resolve(actPrice);
                                    },0)*/
                                
        console.log(`${total} vs ${totalPrice}`);
        if(total !== totalPrice){
            throw new Error (`El total no coincice, debería ser ${totalPrice}$, no ${total}$`);
        }
        console.log("Total ok");

        const newInvoice = await InvoiceModel.create({
            idCliente: idCliente,
            products: products,
            total: total
        });

        res.status(200).send("Invoice creada");
    }
    catch(e){
        res.status(404).send(e);
        return;
    }

   
}