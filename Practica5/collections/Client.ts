import mongoose from "npm:mongoose@7.6.3";
import { TravelModel } from "./Travel.ts";

export type Card = {
    number: string,
    ccv: number,
    expirity: string,
    money: number
}

const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: {type: String, required: true, minlength: 3},
    email: {type: String, required: true, lowercase: true, unique: true},
    cards: [{type: {
        number: {type: String, required: true},
        ccv: {type: Number, required: true},
        expirity: {type: String, required: true},
        money: {type: Number, required: true}
    }, required: false}], 
    travels: [{type: mongoose.Types.ObjectId, ref: `Travels`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]}]
})

ClientSchema.path("email").validate((email) => { //Con una expresion regular validamos que email tenga la estructura de un correo electronico 
    const expReg = /^(\w[\w-\.]*@[\w]+\.[\w]+)?$/;
    if(!expReg.test(email)) throw new Error(`El correo no coincide con la expresión regular`);
    return true; 
})

ClientSchema.path("cards.number").validate(async function(number){ //Con una expresión regular validamos que el nº de la tarjeta tenga la estructura correcta
    const expReg = /^([0-9]{16})$/;
    if(!expReg.test(number)) throw new Error(`El número de la tarjeta debe de ser de exáctamente 16 caracteres`);

    const using = await ClientModel.find({cards: {$elemMatch : {number: number}}}).exec(); //Coger clientes que tengan una tarjeta cuyo número coincida con el nuestro
    if(using.length !== 0) throw new Error(`Este número de tarjeta ya está en uso`);  //Si using no está vacio significa que el número de tarjeta ya está en uso
    return true;
})

ClientSchema.path("cards.ccv").validate((ccv) => {
    if(ccv.toString().length !== 3) throw new Error(`El ccv de la tarjeta debe de ser de exáctamente 3 caracteres`);
    return true;
})

ClientSchema.path("cards.money").validate((money) => {
    if(money < 0) throw new Error(`No se puede añadir una tarjeta sin dinero`);
    return true;
})

ClientSchema.path("cards.expirity").validate((expirity) => { //Con una expresión regular validamos que la fecha en la tarjeta sea de la forma MM/YYYY
    const expReg = /^((0[1-9]|1[0-2])\/[0-9]{4})$/;
    if(!expReg.test(expirity)) throw new Error(`La fecha debe tener la estructura MM/YYYY`);
    return true; 
})


ClientSchema.pre("findOneAndDelete", async function (){
    const id = this.getQuery()["_id"];

    //Antes de borrar el Cliente eliminaremos los viajes que estén asociados a el
    const client = await ClientModel.findById(id).exec();
    await TravelModel.deleteMany({_id: {$in: client?.travels}}).exec(); //Borrar todos los viajes cuyo _id esté en el array `travels` del cliente
})

export type ClientModelType = {
    name: string, 
    email: string,
    cards: [Card],
    travels: [mongoose.Types.ObjectId],
    _id: mongoose.Types.ObjectId
}

export const ClientModel = mongoose.model<ClientModelType>(
    "Clients",
    ClientSchema
)