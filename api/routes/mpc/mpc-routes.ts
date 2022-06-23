import { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { initGenerateEcdsaKey } from "./ecdsa/init";
import { initGenerateGenericSecret, importGenericSecret } from "./ecdsa/secret";
import { signWithEcdsaShare } from "./ecdsa/sign";
import { verifyEcdsaSignature } from "./ecdsa/verify";
import testMcp from "./test";

const route = "/mpc/ecdsa";

const registerMcpRoutes = (server: FastifyInstance): void => {
  server.get("/mpc/test", testMcp);
  server.register(async function (server) {
    server.get(
      route + "/secret",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        initGenerateGenericSecret(connection);
      }
    );
  });
  server.register(async function (server) {
    server.get(
      route + "/import",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        importGenericSecret(connection);
      }
    );
  });
  server.register(async function (server) {
    server.get(
      route + "/init",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        initGenerateEcdsaKey(connection);
      }
    );
  });
  server.register(async function (server) {
    server.get(
      route + "/sign",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        signWithEcdsaShare(connection);
      }
    );
  });

  server.post(route + "/verify", verifyEcdsaSignature);
};

export default registerMcpRoutes;
