import mongoose from "npm:mongoose@6.12.2"
import { ProductModelType } from './product.ts'

const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    idCliente: {type: String, required: true},
    products: {type: Array<String>, required: true}, //Pongo <String porque va  a ser los ID>
    total: {type: Number, required: true},
});

export type InvoiceModelType = {
    idCliente: string,
    products: Array<string>,
    total: number,
    _id: mongoose.Types.ObjectId;
};

export const InvoiceModel = mongoose.model<InvoiceModelType>(
    "invoice",
    InvoiceSchema,
);