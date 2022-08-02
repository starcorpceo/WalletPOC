import { FastifyInstance } from "fastify";
import registerAuthRoutes from "./auth/auth-routes";
import registerMcpRoutes from "./mpc/mpc-routes";
import registerUserRoutes from "./user/user-routes";
import registerTatumRoutes from "./tatum/tatum-routes";

export const registerRoutes = (server: FastifyInstance): void => {
  registerUserRoutes(server);
  registerMcpRoutes(server);
  registerAuthRoutes(server);
  registerTatumRoutes(server);
};
