import { SocketStream } from '@fastify/websocket';
import {
  DoneFuncWithErrOrRes,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { initDeriveBIP32 } from './ecdsa/bip';
import { initGenerateEcdsaKey } from './ecdsa/init';
import { importGenericSecret, initGenerateGenericSecret } from './ecdsa/secret';
import { signWithEcdsaShare } from './ecdsa/sign';
import { verifyEcdsaSignature } from './ecdsa/verify';
import testMcp from './test';

export type ActionStatus = 'Init' | 'Stepping';

const route = '/mpc/ecdsa';

const registerMcpRoutes = (server: FastifyInstance): void => {
  // Open Routes
  server.get('/mpc/test', testMcp);
  server.post(route + '/verify', verifyEcdsaSignature);

  // Routes that need Authentication
  server.register(async function plugin(privatePlugin, _opts) {
    privatePlugin.addHook('onRequest', authenticate);

    registerPrivateMpcRoutes(privatePlugin);
  });
};

const authenticate = (
  req: FastifyRequest,
  res: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  done();
  // const signedNonce = req.cookies["authnonce"];
  // const nonce = req.unsignCookie(signedNonce).value;
  // if (!isNonceValid(nonce)) done(new Error("Missing Header"));
  // console.log(nonce);
  // done();
};

const registerPrivateMpcRoutes = (server: FastifyInstance) => {
  server.register(async function (server) {
    server.get(
      route + '/secret',
      { websocket: true },
      (connection: SocketStream, _req: FastifyRequest) => {
        initGenerateGenericSecret(connection);
      }
    );
  });
  server.register(async function (server) {
    server.get(
      route + '/import',
      { websocket: true },
      (connection: SocketStream, _req: FastifyRequest) => {
        importGenericSecret(connection);
      }
    );
  });
  server.register(async function (server) {
    server.get(
      route + '/derive',
      { websocket: true },
      (connection: SocketStream, _req: FastifyRequest) => {
        initDeriveBIP32(connection);
      }
    );
  });
  server.register(async function (server) {
    server.get(
      route + '/init',
      { websocket: true },
      (connection: SocketStream, _req: FastifyRequest) => {
        initGenerateEcdsaKey(connection);
      }
    );
  });
  server.register(async function (server) {
    server.get(
      route + '/sign',
      { websocket: true },
      (connection: SocketStream, _req: FastifyRequest) => {
        signWithEcdsaShare(connection);
      }
    );
  });
};

export default registerMcpRoutes;
