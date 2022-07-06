import { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { User } from "../user/user";
import { authenticate } from "./authentication";
import { initDeriveBIP32 } from "./ecdsa/bip";
import { initGenerateEcdsaKey } from "./ecdsa/init";
import { importGenericSecret, initGenerateGenericSecret } from "./ecdsa/secret";
import { signWithEcdsaShare } from "./ecdsa/sign";
import { verifyEcdsaSignature } from "./ecdsa/verify";

export type ActionStatus = "Init" | "Stepping";

const route = "/mpc/ecdsa";

const registerMcpRoutes = (server: FastifyInstance): void => {
  // Open Routes
  server.post(route + "/verify", verifyEcdsaSignature);

  // Routes that need Authentication
  server.register(async function plugin(privatePlugin, opts) {
    privatePlugin.addHook("onRequest", authenticate);
    privatePlugin.addHook("onError", async (request, reply, error) => {
      request.log.error({ request: request.body, error }, "Error on MPC Route");
    });

    registerPrivateMpcRoutes(privatePlugin);
  });
};

const registerPrivateMpcRoutes = (server: FastifyInstance) => {
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
      route + "/derive",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        initDeriveBIP32(connection);
      }
    );
  });
  server.register(async function (server) {
    server.get(
      route + "/generateEcdsa",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        const user: User = req["user"];
        initGenerateEcdsaKey(connection, user);
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
};

export default registerMcpRoutes;
