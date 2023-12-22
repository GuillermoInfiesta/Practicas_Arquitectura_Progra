export const gqlSchema = `#graphql
    type Card{
        number: String, #El numero de la tarjeta es un String porque con Int solo podemos números de 32 bits, y los números de 16 dígitos exceden los 32 bits
        ccv: Int,
        expirity: String,
        money: Float
    }
    
    type Client{
        _id: ID!
        name: String!
        email: String!
        cards: [Card]!
        travels: [ID]!
    }

    type Driver{
        _id: ID!
        name: String!
        email: String!
        username: String!
        travels: [ID]!
    }

    type Travel{
        _id: ID!
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
        deleteClient(_id: ID!): String!
        deleteDriver(_id: ID!): String!
        addCard(clientId: ID!, number: String!, ccv: Int!, expirity: String!, money: Float!): String!
        deleteCard(clientId: ID!, number: String!): String!
        changeTravelStatus(_id: ID!): String!
    }   
`;
