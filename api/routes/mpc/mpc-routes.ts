import { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { initGenerateEcdsaKey } from "./ecdsa/init";
import testMcp from "./test";

const registerMcpRoutes = (server: FastifyInstance): void => {
  server.get("/testMpc", testMcp);
  server.register(async function (server) {
    server.get(
      "/initGenerateEcdsaKey",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        initGenerateEcdsaKey(connection);
      }
    );
  });
};

export default registerMcpRoutes;
