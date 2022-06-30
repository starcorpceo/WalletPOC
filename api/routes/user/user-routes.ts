import { nonceRoute, setNonceRoute } from "@lib/route";
import { FastifyInstance, FastifyRequest, FastifySchema } from "fastify";
import {
  CreateUserRequest,
  CreateUserResponse,
  VerifyUserRequest,
} from "./user";
import { createUser, verifyUser } from "./user.service";

const postCreateUser = setNonceRoute<CreateUserResponse>(
  (req: FastifyRequest, nonce: string) => {
    return createUser(req.body as CreateUserRequest, nonce);
  }
);

const postVerifyUser = nonceRoute<boolean>(
  (req: FastifyRequest, nonce: string) => {
    return verifyUser(req.body as VerifyUserRequest, nonce);
  }
);

const registerUserRoutes = (server: FastifyInstance) => {
  server.post("/user/create", { schema: createUserSchema }, postCreateUser);
  server.post("/user/verify", { schema: verifyUserSchema }, postVerifyUser);
};

const createUserSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["devicePublicKey"],
    properties: {
      devicePublicKey: { type: "string", maxLength: 130, minLength: 88 },
    },
  },
};

const verifyUserSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["devicePublicKey", "userId", "signature"],
    properties: {
      devicePublicKey: { type: "string", maxLength: 130, minLength: 88 },
      userId: { type: "string", maxLength: 36, minLength: 36 },
      signature: { type: "string", maxLength: 96, minLength: 96 },
    },
  },
};

export default registerUserRoutes;
