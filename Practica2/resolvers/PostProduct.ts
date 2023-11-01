import {Response, Request} from 'npm:express@4.18.2';
import { ProductModelType, ProductModel } from "../collections/product.ts";

export const postProduct = async(req:Request, res: Response) => {
    const body: Partial<Omit<ProductModelType, "_id">> = req.body;
    const {name, stock, description, price} = body;

    if(!name || !price || price <= 0 || (stock && stock < 0)){
        res.status(303).send("Al producto le faltan datos o tiene incorrectos (price <= 0 ó stock < 0)");
        return;
    }
    //Comprobar que el stock no sea negativo, que no tengan distinto precio si ya esta ese prod, etc... 
    //Sobre escribir el producto con los datos del nuevo y sumar stack si es valido quizás.
    const exists = await ProductModel.findOne({name}).exec();

    if(exists){

        const filter = {name: name};

        //Los cambios que queremos que ocurran en el update, en este caso cambiamos el precio y descripcion a los del prodcto nuevo, pero el stock 
        //lo sumamos al anterior
        const changes = { 
            price: price,
            stock: (stock ?? 0) + exists.stock,
            description: description
        }
        await ProductModel.findOneAndUpdate(filter, changes);

        res.status(200).send("El producto ya existía, valores actualizados");
        return;
    }
    await ProductModel.create({
        name, 
        stock,
        description,
        price,
    });
    
    res.status(200).send("Producto añadido");
}