import mongoose from "npm:mongoose@6.12.2"

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {type: String, required: true },
    stock: {type: Number, required: false, default: 0},
    description: {type: String, required: false, default: ""},
    price: {type: Number, required: true},
});

export type ProductModelType = {
    name: string,
    stock: number,
    description: string,
    price: number,
    _id: mongoose.Types.ObjectId;
};

export const ProductModel = mongoose.model<ProductModelType>(
    "product",
    ProductSchema,
);