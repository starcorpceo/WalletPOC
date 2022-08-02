import { nonceRoute } from "@lib/route";
import { FastifyInstance, FastifyRequest, FastifySchema } from "fastify";
import {
  CreateTatumConnectionRequest,
  CreateTatumConnectionResponse,
  GetTatumConnectionRequest,
  GetTatumConnectionResponse,
} from "./tatum";
import { createTatumConnection, findTatumConnection } from "./tatum.service";

const postCreateTatumConnection = nonceRoute<CreateTatumConnectionResponse>(
  (req: FastifyRequest) => {
    return createTatumConnection(req.body as CreateTatumConnectionRequest);
  }
);

const getTatumConnection = nonceRoute<GetTatumConnectionResponse>(
  (req: FastifyRequest) => {
    return findTatumConnection(req.query as GetTatumConnectionRequest);
  }
);

const registerTatumRoutes = (server: FastifyInstance) => {
  server.post(
    "/tatum/connection/create",
    { schema: createTatumConnectionSchema },
    postCreateTatumConnection
  );
  server.get(
    "/tatum/connection/get",
    { schema: getTatumConnectionSchema },
    getTatumConnection
  );
};

const createTatumConnectionSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["accountAddress", "tatumId"],
    properties: {
      accountAddress: { type: "string", maxLength: 44, minLength: 20 },
      tatumId: { type: "string", maxLength: 24, minLength: 24 },
    },
  },
};

const getTatumConnectionSchema: FastifySchema = {
  querystring: {
    type: "object",
    required: ["accountAddress"],
    properties: {
      accountAddress: { type: "string", maxLength: 44, minLength: 20 },
    },
  },
};

export default registerTatumRoutes;
