import mongoose from "npm:mongoose@7.6.3"
import { GestorModel } from './Gestor.ts';

const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
    nombre: {type: String, required: true},
    dni: {type: String, required: true, unique: true},
    correo: {type: String, required: true},
    telefono: {type: Number, required: true},
    dineroCuenta: {type: Number, required: false, default: 0},
    idGestor: {type: String, required: false, default: ""},
});

ClienteSchema.path("dni").validate(async (dni) => {
    const exists = await ClienteModel.findOne().where("dni").equals(dni).exec();
    if(exists) throw new Error(`Ya existe un cliente con el dni ${dni}`);
    return true;
})

ClienteSchema.path("dineroCuenta").validate((dinero) => {
    if(dinero < 0) throw new Error(`La cantidad de dinero al iniciar una cuenta no puede ser menor que 0`);
    return true;
})

ClienteSchema.path("idGestor").validate(async (idGestor) => {
    if(idGestor === "") return true;
    const gestor = await GestorModel.findById(idGestor).exec();
    if(!gestor) throw new Error(`No existe ningun gestor con id ${idGestor}`);
    if(gestor.numeroClientes === 10) throw new Error(`El gestor ya ha alcanzado su máximo de clientes`);
    return true;
})

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