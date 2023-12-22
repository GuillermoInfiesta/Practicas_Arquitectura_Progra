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
    if(!exists) throw new Error(`El cliente no existe`); //Comprobar que el cliente exista
    
    const availableCards = exists.cards.filter((card) => card.money >= this.money); //De las tarjetas del cliente, guardar en `availableCards` las que tengan suficiente dinero para el viaje
    if(availableCards.length === 0) throw new Error(`El cliente no tiene ninguna tarjeta con la cual pueda pagar`); //Si `availableCards` está vacio significa que el cliente no puede pagar
    exists.cards[exists.cards.indexOf(availableCards[0])].money -= this.money; //Quitamos el dinero de cualquiera de las tarjetas disponibles
    await exists.save({validateBeforeSave: false}); //Actualizamos el cliente para que se guarden los cambios de la tarjeta con la que pagó
    return true;
})

TravelSchema.path("driver").validate(async(driver) => {
    const exists = await DriverModel.findById(driver).exec();
    if(!exists) throw new Error(`El conductor no existe`);
    return true;    
})

TravelSchema.path("date").validate((date) => { //Con una expresión regular comprobamos que la fecha del viaje siga el formato "MM/YYYY"
    const expReg = /^((0[1-9]|1[0-2])\/[0-9]{4})$/;
    if(!expReg.test(date)) throw new Error(`La fecha debe tener la estructura MM/YYYY`);
    return true; 
})

TravelSchema.post("save", async function () {
    //Al añadir un viaje lo añadimos también a los arrays de viajes del cliente y conductor
    await ClientModel.findOneAndUpdate({_id: this.client},{$push: {travels: this._id}}).exec()
    await DriverModel.findOneAndUpdate({_id: this.driver},{$push: {travels: this._id}}).exec()
})

TravelSchema.pre("findOneAndUpdate", async function () {
    const id = this.getQuery()["_id"]; //De la query que usamos para el findOneAndUpdate cogemos el _id para asi tener el id del viaje a actualizar
    if(id === undefined) throw new Error(`No existe el viaje`);

    const travel = await TravelModel.findById(id).exec(); //Cogemos el viaje que se va a actualizar
    if(!travel) throw new Error(`No existe el viaje`);

    if(travel.status === "Finished") throw new Error(`El viaje ya terminó, no se puede actualizar más`); 

    if(travel.status === "Waiting"){
        //---------------Comprobar que el cliente y el conductor no tengan viajes en curso---------------------------------------------
        const client = await ClientModel.findById(travel.client).exec(); //Mirar si se podria con el populate de viajes asi solo hay que hacer una busqueda
        const onGoingC = await TravelModel.find({_id: { $in: client?.travels}, status: "On Course"}).exec(); //Buscar los viajes que pertenezcan al cliente y tengan status "On Course"
        if(onGoingC.length !== 0) throw new Error(`El cliente ya tiene un viaje en progreso`);

        const driver = await DriverModel.findById(travel.driver).exec();
        const onGoingD = await TravelModel.find({_id: { $in: driver?.travels}, status: "On Course"}).exec(); //Buscar los viajes que pertenezcan al conducutor y tengan status "On Course"
        if(onGoingD.length !== 0) throw new Error(`El conductor ya tiene un viaje en progreso`);
        //-----------------------------------------------------------------------------------------------------------------------------
    }

    //Como el status del viaje avanza de forma Waiting -> On Course -> Finished, y como los estados se ecnuentran en ese orden en la enum, solo necesitamos utilizar el siguiente indice
    //Es decir, como Waiting es [0] en statusVal, para pasar a On Course (que es [1] en statusVal) solo necesitamos el valor del siguiente indice
    const index = statusVal.indexOf(travel.status);
    const nextIndex = (index+1) % statusVal.length; //Calculamos nuevo indice
    const newStatus = statusVal[nextIndex]; //Nuestro nuevo status es statusVal en la posicion de nuestro nuevo indice
    this.setUpdate({$set: {status: newStatus}}); //La update, que inicialmente venia vacia ({}) la modificamos para que ahora sea cambiar el status
})

TravelSchema.pre("deleteMany", async function (){ //Solo se llama una vez al ser un many, no es como el resto qeu se llama uno para cada uno que se actualiza
    const deletedIDs = this.getQuery()["_id"]["$in"]; //La query tiene la forma {_id: {$in :[los ids a eliminar]}}, asique si hacemos ["_id"]["$in"] cogemos los ids que se van a eliminar
    
    const deletedTravels = await TravelModel.find({_id: {$in: deletedIDs}}).exec(); //Cogemos todos los viajes que se van a eliminar
    //Para cada viaje que se vaya a eliminar iremos a su cliente y conductor y sacaremos el viaje de sus arrays `travels`
    await Promise.all(deletedTravels.map(async(travel) => {
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