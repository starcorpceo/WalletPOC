import { FastifyInstance } from "fastify";
import registerMcpRoutes from "./mpc/mpc-routes";
import registerUserRoutes from "./user/user-routes";

export const registerRoutes = (server: FastifyInstance): void => {
  registerUserRoutes(server);
  registerMcpRoutes(server);
};
