import {Response, Request} from 'npm:express@4.18.2';
import {ProductModel } from "../collections/product.ts";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    const products = await ProductModel.find({}).exec();
    if( products.length < 1){
        res.status(404).send("No existen productos");
        return;
    }
    res.status(200).send(products);
}