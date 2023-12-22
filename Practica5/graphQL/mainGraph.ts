import {ClientModel, ClientModelType} from "../collections/Client.ts";
import {DriverModel, DriverModelType} from "../collections/Driver.ts";
import {TravelModel,TravelModelType} from "../collections/Travel.ts";
import mongoose from "npm:mongoose@7.6.3"


export type Card = {
    number: string,
    ccv: number,
    expirity: string,
    money: number
}

type Client = {
    id: mongoose.Types.ObjectId,
    name: string, 
    email: string,
    cards: [Card],
    travels: [mongoose.Types.ObjectId]
}

type Driver = {
    id: mongoose.Types.ObjectId,
    name: string,
    email: string,
    username: string,
    travels: [mongoose.Types.ObjectId]
}

type Travel = {
    id: mongoose.Types.ObjectId,
    client: mongoose.Types.ObjectId,
    driver: mongoose.Types.ObjectId,
    money: number,
    distance: number,
    date: string,
    status: string
}

export const gqlSchema = `#graphql
    type Card{
        number: String,
        ccv: Int,
        expirity: String,
        money: Float
    }
    
    type Client{
        id: ID!
        name: String!
        email: String!
        cards: [Card]!
        travels: [ID]!
    }

    type Driver{
        id: ID!
        name: String!
        email: String!
        username: String!
        travels: [ID]!
    }

    type Travel{
        id: ID!
        client: ID!
        driver: ID!
        money: Float!
        distance: Float!
        date: String!
        status: String!
    }

    type Query{
        clients: [Client]!
        drivers: [Driver]!
        travels: [Travel]!
    }

    type Mutation{
        addClient(name: String!, email: String!): String!
        addDriver(name: String!, email: String!, username: String!): String!
        addTravel(client: ID!, driver: ID!, money: Float!, distance: Float!, date: String!): String!
        deleteClient(id: ID!): String!
        deleteDriver(id: ID!): String!
        addCard(clientId: ID!, number: String!, ccv: Int!, expirity: String!, money: Float!): String!
        deleteCard(clientId: ID!, number: String!): String!
        changeTravelStatus(id: ID!): String!
    }   
`;

export const Query = {
    clients: async (): Promise<Client[]> => {
        const clients = await ClientModel.find().exec();
        return clients.map((client): Client => {
            return {
                id: client._id,
                name: client.name,
                email: client.email,
                cards: client.cards,
                travels: client.travels
            }
        });
    },
    drivers: async (): Promise<Driver[]> => {
        const drivers = await DriverModel.find().exec();
        return drivers.map((driver):Driver => {
            return {
                id: driver._id,
                name: driver.name,
                email: driver.email,
                username: driver.username,
                travels: driver.travels
            }
        });
    },
    travels: async (): Promise<Travel[]> => {
        const travels = await TravelModel.find().exec();
        return travels.map((travel):Travel => {
            return {
                id: travel._id,
                client: travel.client,
                driver: travel.driver,
                money: travel.money,
                distance: travel.distance,
                date: travel.date,
                status: travel.status
            }
        });
    }
}

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
    deleteClient: async(_:unknown, args: {id: string}): Promise<string> => {
        try{
            const {id} = args;
            await ClientModel.findOneAndDelete().where(`_id`).equals(id).exec();
            return `Cliente eliminado`;
        }catch(e){
            return e.message;
        }
    },
    deleteDriver: async(_:unknown, args: {id: string}): Promise<string> => {
        try{
            const {id} = args;
            await DriverModel.findOneAndDelete().where(`_id`).equals(id).exec();
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
    changeTravelStatus: async(_:unknown, args: {id: string}): Promise<string> => {
        try{
            const {id} = args;
            await TravelModel.findOneAndUpdate({_id: id},{}).exec() //Avanzar el status. Waiting -> On Progress -> Finished
            return `Status updated`;
        }catch(e){
            return e.message;
        }
    }
}