import { FastifyInstance } from "fastify";
import registerMcpRoutes from "./mpc";
import registerUserRoutes from "./user";

export const registerRoutes = (server: FastifyInstance): void => {
  registerUserRoutes(server);
  registerMcpRoutes(server);
};
