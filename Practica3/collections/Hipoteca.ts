import mongoose from "npm:mongoose@7.6.3"
import { ClienteModel } from './Cliente.ts';

const Schema = mongoose.Schema;

const HipotecaSchema = new Schema ({
    total: {type: Number, required: true},
    cuotas: {type: Number, required: false, default: 20},
    idCliente: {type: String, required: true}, 
    pagoCuota: {type: Number, required: true}
});

HipotecaSchema.path("total").validate((total) => {
    if(total > 1000000) throw new Error(`El total (${total}) supera el límite de 1000000`);
    if(total <= 0) throw new Error(`El total (${total}) debe ser mayor que 0`);
    return true;
})

HipotecaSchema.path("idCliente").validate(async (id) => {
    const cliente = await ClienteModel.findById(id).exec();
    if(!cliente) throw new Error(`No existe ningun cliente con id ${id}`);
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