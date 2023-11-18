import mongoose from "npm:mongoose@7.6.3"

const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
    nombre: {type: String, required: true},
    dni: {type: String, required: true},
    correo: {type: String, required: true},
    telefono: {type: Number, required: true},
    dineroCuenta: {type: Number, required: false, default: 0},
    idGestor: {type: String, required: false, default: ""},
});

export type ClienteModelType = {
    nombre: string,
    dni: string,
    correo: string, 
    telefono: number,
    idGestor: string,
    dineroCuenta: number,
    _id: mongoose.Types.ObjectId;
}

export const ClienteModel = mongoose.model<ClienteModelType>(
    "Clientes",
    ClienteSchema,
);