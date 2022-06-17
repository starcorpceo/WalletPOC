import { FastifyInstance } from "fastify";
import { initGenerateEcdsaKey } from "./ecdsa";
import testMcp from "./test";

const registerMcpRoutes = (server: FastifyInstance): void => {
  server.get("/testMpc", testMcp);
  server.post("/initGenerateEcdsaKey", initGenerateEcdsaKey);
};

export default registerMcpRoutes;
