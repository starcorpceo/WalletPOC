import websocketPlugin from "@fastify/websocket";
import config from "@lib/config";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import logger from "./lib/logger";
import { registerRoutes } from "./routes/register-routes";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fastify = require("fastify");

const server: FastifyInstance = fastify();

// eslint-disable-next-line @typescript-eslint/no-var-requires
server.register(websocketPlugin);

export const client: PrismaClient = new PrismaClient({
  datasources: { db: { url: config.databaseUrl } },
});

registerRoutes(server);

server.all("*", (request, reply) => {
  reply.status(404).send({ error: "Route does not exist" });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaugh Exception " + err);
  logger.warn("Shutting down server because of uncaught exception");

  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  const errorMsg = [`Unhandled Promise Rejection`, `Reason: ${reason}`].join(
    ",\n"
  );

  console.log({
    error: errorMsg,
  });

  // need to log the promise without stringifying it to properly
  // display all rejection info
  console.log(promise);

  // TODO: stream errors to sentry

  process.exit(1);
});
