import {Response, Request} from 'npm:express@4.18.2';
import {ProductModel} from "../collections/product.ts";

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    //Copiar el borrar de la api rest para los casos en los que las id no son de 24 hex
    const deleted = await ProductModel.deleteOne().where("_id").equals(id).exec();
     
    if(deleted.deletedCount == 0){
        res.status(404).send("Error 404: Personaje NOT FOUND");
        return;
    }

    res.status(200).send("Producto eliminado");
}