import mongoose from "npm:mongoose@7.6.3"
import { TravelModel } from './Travel.ts';

const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, lowercase: true, unique: true},
    username: {type: String, required: true, unique: true},
    travels: [{type: mongoose.Types.ObjectId, required: true, ref: `Travels`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]}]
})

DriverSchema.path("email").validate((email) => {
    const expReg = /^(\w[\w-\.]*@[\w]+\.[\w]+)?$/;
    if(!expReg.test(email)) throw new Error(`El correo no coincide con la expresión regular`);
    return true; 
})


DriverSchema.pre("findOneAndDelete", async function (){
    const id = this.getQuery()["_id"];
    const driver = await DriverModel.findById(id).exec();
    await TravelModel.deleteMany({_id: {$in: driver?.travels}}).exec();
})


export type DriverModelType = {
    name: string, 
    email: string,
    username: string,
    travels: [mongoose.Types.ObjectId],
    _id: mongoose.Types.ObjectId
}

export const DriverModel = mongoose.model<DriverModelType>(
    "Drivers",
    DriverSchema
)