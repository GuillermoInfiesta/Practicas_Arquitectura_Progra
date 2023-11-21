import mongoose from "npm:mongoose@7.6.3"
import { ClienteModel } from './Cliente.ts';

const Schema = mongoose.Schema;

const HipotecaSchema = new Schema ({
    total: {type: Number, required: true},
    cuotas: {type: Number, required: false, default: 20},
    idCliente: {type: String, required: true}, 
    pagoCuota: {type: Number, required: true}
});

//Validaremos el Total a pagar y cliente antes de añadir a la base de datos, en caso de que un valor no sea valído saltará un error y se detendrá la creación

HipotecaSchema.path("total").validate((total) => {
    if(total > 1000000) throw new Error(`El total (${total}) supera el límite de 1000000`);
    if(total <= 0) throw new Error(`El total (${total}) debe ser mayor que 0`);
    return true;
})

HipotecaSchema.path("idCliente").validate(async (id) => {
    const cliente = await ClienteModel.findById(id).exec();
    if(!cliente) throw new Error(`No existe ningun cliente con id ${id}`);
    //El cliente necesita un gestor para poder tener hipotecas, por eso a parte de que el cliente exista comprobamos que tenga gestor
    //Si tiene gestor sabemos que siempre va a ser valido por como esta hecho el programa, ya que no se puede eliminar un gestor, y al
    //asignar gestor compobamos que sea válido
    if(cliente.idGestor === "") throw new Error(`El cliente no tiene ningun gestor asignado, por favor asignele uno antes de continuar`);
    return true;
})
export type HipotecaModelType = {
    total: number,
    cuotas: number,
    idCliente: string,
    pagoCuota: number,
    _id: mongoose.Types.ObjectId;
}

export const HipotecaModel = mongoose.model<HipotecaModelType>(
    "Hipotecas",
    HipotecaSchema,
);