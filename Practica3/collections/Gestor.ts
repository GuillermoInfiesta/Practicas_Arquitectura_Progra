import mongoose from "npm:mongoose@7.6.3"

const Schema = mongoose.Schema;

const GestorSchema = new Schema ({
    nombre: {type: String, required: true},
    dni: {type: String, required: true},
    idClientes: {type: Array<String>, required: false, default: []},
    numeroClientes: {type: Number, required: false, default: 0}
});

export type GestorModelType = {
    nombre: string,
    dni: string,
    idClientes: string[],
    numeroClientes: number,
    _id: mongoose.Types.ObjectId;
}

export const GestorModel = mongoose.model<GestorModelType>(
    "Gestores",
    GestorSchema
)