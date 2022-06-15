import { FastifyInstance } from "fastify";
import testMcp from "./test";

const registerMcpRoutes = (server: FastifyInstance): void => {
  server.get("/testMpc", testMcp);
};

export default registerMcpRoutes;
