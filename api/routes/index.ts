import { FastifyInstance } from "fastify";
import registerUserRoutes from "./user";

export const registerRoutes = (server: FastifyInstance): void => {
  registerUserRoutes(server);
};
