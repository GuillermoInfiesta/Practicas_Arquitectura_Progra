import {ClientModel, ClientModelType, Card} from "../collections/Client.ts";
import {DriverModel, DriverModelType} from "../collections/Driver.ts";
import {TravelModel,TravelModelType} from "../collections/Travel.ts";


export const Query = {
    clients: async (): Promise<ClientModelType[]> => {
        const clients = await ClientModel.find().exec();
        return clients.map((client): ClientModelType => {
            return {
                _id: client._id,
                name: client.name,
                email: client.email,
                cards: client.cards,
                travels: client.travels
            }
        });
    },
    drivers: async (): Promise<DriverModelType[]> => {
        const drivers = await DriverModel.find().exec();
        return drivers.map((driver):DriverModelType => {
            return {
                _id: driver._id,
                name: driver.name,
                email: driver.email,
                username: driver.username,
                travels: driver.travels
            }
        });
    },
    travels: async (): Promise<TravelModelType[]> => {
        const travels = await TravelModel.find().exec();
        return travels.map((travel):TravelModelType => {
            return {
                _id: travel._id,
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
