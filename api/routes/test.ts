import { FastifyInstance } from "fastify";
import { okAsync } from "neverthrow";
import { route } from "../lib/route";

const handler = route<String>(() => {
  return okAsync("Wassup");
});

export const registerRoutes = (server: FastifyInstance): void => {
  server.get("/test", handler);
};
