import {Response, Request} from 'npm:express@4.18.2';
import {ProductModel } from "../collections/product.ts";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    if(!ProductModel.exists){
        res.status(404).send("No existe un almacen de productos")
    }
    const products = await ProductModel.find({}).exec();
    if( products.length < 1){
        res.status(404).send("No existen productos");
        return;
    }
    res.status(200).send(products);
}