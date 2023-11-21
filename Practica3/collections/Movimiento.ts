import mongoose from "npm:mongoose@7.6.3"
import { ClienteModel } from './Cliente.ts';
import { HipotecaModel } from './Hipoteca.ts';

const Schema = mongoose.Schema;

const MovimientoSchema = new Schema ({
    idSender: {type: String, required: false, default: ""},
    idReceiver: {type: String, required: true, default: ""},
    dinero: {type: Number, required: true},
    detalles: {type: String, required: true}
}, {timestamps: true});

//Validaremos el emisor, receptor y dinero antes de añadir a la base de datos, en caso de que un valor no sea valído saltará un error y se detendrá la creación

MovimientoSchema.path("idSender").validate(async (id) => {
    if(id === "") return true;
    const sender = await ClienteModel.findById(id).exec();
    if(!sender) return false;
    return true;
})

MovimientoSchema.path("idReceiver").validate(async (id) => {
    const receiver = await ClienteModel.findById(id).exec();
    if(receiver) return true;
    const hipoteca = await HipotecaModel.findById(id).exec();
    if(hipoteca) return true;
    return false;
})

MovimientoSchema.path("dinero").validate((dinero) => {
    if(dinero < 0) return false;
    return true;
})

export type MovimientoModelType = {
    idSender: string,
    idReceiver: string,
    dinero: number,
    detalles: string,
    createdAt: mongoose.Date
};

export const MovimientoModel = mongoose.model<MovimientoModelType>(
    "Movimientos",
    MovimientoSchema
);