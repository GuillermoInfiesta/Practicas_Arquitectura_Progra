import mongoose from "npm:mongoose@7.6.3"
import { ClientModel } from "./Client.ts";
import { DriverModel } from './Driver.ts';

const Schema = mongoose.Schema;

const statusVal = [`Waiting`,`On Course`,`Finished`];
const TravelSchema = new Schema({
    client: {type: mongoose.Types.ObjectId, required: true, ref: `Clients`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]},
    driver: {type: mongoose.Types.ObjectId, required: true, ref: `Drivers`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]},
    money: {type: Number, required: true, min: [5, `El dinero del viaje está por debajo del mínimo permitido(5$)`]},
    distance: {type: Number, required: true, min: [0.01, `La distancia del viaje está por debajo del mínimo permitido(0.01Km)`]},
    date: {type: String, required: true},
    status: {type: String, enum: {values: statusVal, message: `El status que estas intentando asignar no existe`}, required: false, default: "Waiting"}
})

TravelSchema.path("client").validate(async function(client){
    const exists = await ClientModel.findById(client).exec();
    if(!exists) throw new Error(`El cliente no existe`);
    
    const availableCards = exists.cards.filter((card) => card.money >= this.money);
    if(availableCards.length === 0) throw new Error(`El cliente no tiene ninguna tarjeta con la cual pueda pagar`);
    exists.cards[exists.cards.indexOf(availableCards[0])].money -= this.money;
    await exists.save();
    return true;
})

TravelSchema.path("driver").validate(async(driver) => {
    const exists = await DriverModel.findById(driver).exec();
    if(!exists) throw new Error(`El conductor no existe`);
    return true;    
})

TravelSchema.path("date").validate((date) => {
    const expReg = /^((0[1-9]|1[0-2])\/[0-9]{4})$/; //Checkear con sara
    if(!expReg.test(date)) throw new Error(`La fecha debe tener la estructura MM/YYYY`);
    return true; 
})

/*TravelSchema.pre("save", async function () { Muteo esto porque voy a hacer que por default empiece en Waiting, asique no hay checkeos
    if(this.status === "Finished") throw new Error(`Los viajes se pueden introducir como planeados o en curso, pero no completos`)
    if(this.status === "On Course"){
        const client = await ClientModel.findById(this.client.toString()).exec(); //Mirar si se podria con el populate de viajes asi solo hay que hacer una busqueda
        const onGoingC = await TravelModel.find({_id: { $in: client?.travels}, status: "On Course"}).exec();
        if(onGoingC.length !== 0) throw new Error(`El cliente ya tiene un viaje en progreso`);
        //const onGoing = client?.travels.some((trip) => trip.status === "On Going");

        const driver = await DriverModel.findById(this.driver.toString()).exec();
        const onGoingD = await TravelModel.find({_id: { $in: driver?.travels}, status: "On Course"}).exec();
        if(onGoingD.length !== 0) throw new Error(`El conductor ya tiene un viaje en progreso`);
    }
})*/

TravelSchema.post("save", async function () {
    await ClientModel.findOneAndUpdate({_id: this.client},{$push: {travels: this._id}}).exec()
    await DriverModel.findOneAndUpdate({_id: this.driver},{$push: {travels: this._id}}).exec()
})

TravelSchema.pre("findOneAndUpdate", async function () {
    const id = this.getQuery()["_id"];
    if(id === undefined) throw new Error(`No existe el viaje`);

    const travel = await TravelModel.findById(id).exec();
    if(!travel) throw new Error(`No existe el viaje`);

    if(travel.status === "Finished") throw new Error(`El viaje ya terminó, no se puede actualizar más`);

    if(travel.status === "Waiting"){
        const client = await ClientModel.findById(travel.client).exec(); //Mirar si se podria con el populate de viajes asi solo hay que hacer una busqueda
        const onGoingC = await TravelModel.find({_id: { $in: client?.travels}, status: "On Course"}).exec();
        //console.log(`Cliente on going:${onGoingC}`);
        if(onGoingC.length !== 0) throw new Error(`El cliente ya tiene un viaje en progreso`);

        const driver = await DriverModel.findById(travel.driver).exec();
        const onGoingD = await TravelModel.find({_id: { $in: driver?.travels}, status: "On Course"}).exec();
        if(onGoingD.length !== 0) throw new Error(`El conductor ya tiene un viaje en progreso`);
    }

    const index = statusVal.indexOf(travel.status);
    const nextIndex = (index+1) % statusVal.length;
    const newStatus = statusVal[nextIndex];
    this.setUpdate({$set: {status: newStatus}});
})

TravelSchema.pre("deleteMany", async function (){ //Solo se llama una vez al ser un many, no es como el resto qeu se llama uno para cada uno que se actualiza
    /*console.log(this.getQuery());
    console.log(this.getFilter());*/

    const deletedIDs = this.getQuery()["_id"]["$in"];
    //console.log(deletedIDs);
    const deletedTravels = await TravelModel.find({_id: {$in: deletedIDs}}).exec();
    //console.log(deletedTravels);
    await Promise.all(deletedTravels.map(async(travel) => {
        //console.log(`Client id ${travel.client}`)
        //console.log(`travel id ${travel._id}`);
        await ClientModel.findOneAndUpdate({_id: travel.client},{$pull: {travels: travel._id}}).exec();
        await DriverModel.findOneAndUpdate({_id: travel.driver},{$pull: {travels: travel._id}}).exec();
    }))

})

export type TravelModelType = {
    client: mongoose.Types.ObjectId,
    driver: mongoose.Types.ObjectId,
    money: number,
    distance: number,
    date: string,
    status: string,
    _id: mongoose.Types.ObjectId
}

export const TravelModel = mongoose.model<TravelModelType>(
    `Travels`,
    TravelSchema
)