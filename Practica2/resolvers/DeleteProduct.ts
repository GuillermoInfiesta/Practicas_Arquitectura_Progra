import {Response, Request} from 'npm:express@4.18.2';
import {ProductModel} from "../collections/product.ts";
import { checkIdLength } from '../verifiers/checkIdLength.ts';

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    
    try{
        checkIdLength(id);
    }catch(e){
        res.status(400).send(e.message);
        return;
    }

    const deleted = await ProductModel.deleteOne().where("_id").equals(id).exec();
     
    if(deleted.deletedCount == 0){
        res.status(404).send("Error 404: Producto no encontrado");
        return;
    }

    res.status(200).send("Producto eliminado");
}