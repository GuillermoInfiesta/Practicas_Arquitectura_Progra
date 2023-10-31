import {Response, Request} from 'npm:express@4.18.2';
import { ProductModelType, ProductModel } from "../collections/product.ts";

export const postProduct = async(req:Request, res: Response) => {
    const body: Partial<Omit<ProductModelType, "_id">> = req.body;
    const {name, stock, description, price} = body;

    if(!name || !price || price <= 0 || (stock && stock < 0)){
        res.status(303).send("El articulo no incluye nombre y/o precio");
        return;
    }
    //Comprobar que el stock no sea negativo, que no tengan distinto precio si ya esta ese prod, etc... 
    //Sobre escribir el producto con los datos del nuevo y sumar stack si es valido quizás.
    const exists = await ProductModel.findOne({name}).exec();

    //Algo falla, crea un nuevo prod en vez de cambiar valores
    if(exists /*&& stock*/){
        const filter = {name: name};
        const changes = {
            price: price,
            stock: (stock ?? 0) + exists.stock,
            description: description
        }
        await ProductModel.findOneAndUpdate(filter, changes);
        /*
        exists.name = name;
        if(stock)
            exists.stock += stock;
        exists.description = description ?? "";
        exists.price = price;
        res.status(200).send("El producto ya existia, valores actualizados");
        return;*/
        res.status(200).send("El producto ya existia, valores actualizados");
        return;
    }

    /*const newProduct = await ProductModel.create({
        name, 
        stock,
        description,
        price,
    });*/
    
    await ProductModel.create({
        name, 
        stock,
        description,
        price,
    });
    
    res.status(200).send("Producto añadido");
}