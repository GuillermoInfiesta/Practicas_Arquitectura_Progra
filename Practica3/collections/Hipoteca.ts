import mongoose from "npm:mongoose@7.6.3"

const Schema = mongoose.Schema;

const HipotecaSchema = new Schema ({
    total: {type: Number, required: true},
    cuotas: {type: Number, required: false, default: 20},
    idCliente: {type: String, required: true}, //Quizas Cambiar a plural este y gestores
    idGestor: {type: String, required: true},
    pagoCuota: {type: Number, required: true}
});

export type HipotecaModelType = {
    total: number,
    cuotas: number,
    idCliente: string,
    idGestor: string,
    pagoCuota: number,
    _id: mongoose.Types.ObjectId;
}

export const HipotecaModel = mongoose.model<HipotecaModelType>(
    "Hipotecas",
    HipotecaSchema,
);