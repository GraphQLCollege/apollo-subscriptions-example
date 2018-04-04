require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { PostgresPubSub } = require("graphql-postgres-subscriptions");

const pubsub = new PostgresPubSub({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DB,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT
});

const database = require("./database");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

const typeDefs = `
  type Pin { title: String!, link: String!, image: String!, id: Int! }
  type Query { pins: [Pin] }
  type Mutation { addPin(title: String!, link: String!, image: String!): Int }
  type Subscription { pinAdded: Pin }
`;

const resolvers = {
  Query: {
    pins: async () => {
      const pins = await database("pins").select();
      return pins;
    }
  },
  Mutation: {
    addPin: async (_, { title, link, image }) => {
      const [id] = await database("pins")
        .returning("id")
        .insert({ title, link, image });
      pubsub.publish("pinAdded", { pinAdded: { title, link, image, id } });
      return id;
    }
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator("pinAdded")
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
const server = express();

server.use(cors());

server.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

server.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: `ws://${HOST}:${PORT}/subscriptions`
  })
);

const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`Go to http://${HOST}:${PORT}/graphiql to run queries!`);
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );
});
