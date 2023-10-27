import mongoose from "npm:mongoose@6.12.2"

const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: {type: String, required: true},
    cif: {type: String, required: true},
});

export type ClientModelType ={
    name: string,
    cif: string,
    _id: mongoose.Types.ObjectId;
};

export const ClientModel = mongoose.model<ClientModelType>(
    "client",
    ClientSchema,
);