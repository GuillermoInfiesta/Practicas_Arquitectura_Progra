import {ClientModel, ClientModelType, Card} from "../collections/Client.ts";
import {DriverModel, DriverModelType} from "../collections/Driver.ts";
import {TravelModel,TravelModelType} from "../collections/Travel.ts";


export const Mutation = {
    addClient: async(_:unknown, args: {name: string, email: string}): Promise<string> => {
        try{
            const {name, email} = args;
            await ClientModel.create({name, email});
            return `Cliente creado`;
        }catch(e){
            return e.message;
        }
    },
    addDriver: async(_:unknown, args: {name: string, email: string, username: string}): Promise<string> => {
        try{
            const {name, email, username} = args;
            await DriverModel.create({name, email, username});
            return `Conductor creado`;
        }catch(e){
            return e.message;
        }
    },
    addTravel: async(_:unknown, args:{client: string, driver: string, money: number, distance: number, date: string}): Promise<string> => {
        try{
            const {client, driver, money, distance, date} = args;
            await TravelModel.create({client, driver, money, distance, date});
            return `Viaje creado`;
        }catch(e){
            return e.message;
        }
    },
    deleteClient: async(_:unknown, args: {_id: string}): Promise<string> => {
        try{
            const {_id} = args;
            await ClientModel.findOneAndDelete().where(`_id`).equals(_id).exec();
            return `Cliente eliminado`;
        }catch(e){
            return e.message;
        }
    },
    deleteDriver: async(_:unknown, args: {_id: string}): Promise<string> => {
        try{
            const {_id} = args;
            await DriverModel.findOneAndDelete().where(`_id`).equals(_id).exec();
            return `Conductor eliminado`;
        }catch(e){
            return e.message;
        }
    },
    addCard: async(_:unknown, args: {clientId: string, number: string, ccv: number, expirity: string, money: number}): Promise<string> => {
        try{
            const {clientId, number, ccv, expirity, money} = args;
            const card: Card = {
                number, ccv, expirity, money
            }
            await ClientModel.findOneAndUpdate({_id: clientId},{$push: {cards: card}},{runValidators : true}).exec();
            return `Tarjeta añadida`;
        }catch(e){
            return e.message;
        }
    },
    deleteCard: async(_:unknown, args: {clientId: string, number: string}): Promise<string> => {
        try{
            const {clientId, number} = args;
            await ClientModel.findOneAndUpdate({_id: clientId},{$pull: {cards: {number: number}}}).exec(); //Ver como hacer para pull por numero de la tarjeta
            return `Tarjeta eliminada`;
        }catch(e){
            return e.message;
        }
    },
    changeTravelStatus: async(_:unknown, args: {_id: string}): Promise<string> => {
        try{
            const {_id} = args;
            await TravelModel.findOneAndUpdate({_id: _id},{}).exec() //Avanzar el status. Waiting -> On Progress -> Finished
            return `Status updated`;
        }catch(e){
            return e.message;
        }
    }
}