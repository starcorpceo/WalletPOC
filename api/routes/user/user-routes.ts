import { route } from "@lib/route";
import { FastifyInstance, FastifyRequest, FastifySchema } from "fastify";
import {
  CreateUserRequest,
  CreateUserResponse,
  VerifyUserRequest,
} from "./user";
import { createUser, verifyUser } from "./user.service";

const postCreateUser = route<CreateUserResponse>((req: FastifyRequest) => {
  return createUser(req.body as CreateUserRequest);
});

const postVerifyUser = route<boolean>((req: FastifyRequest) => {
  return verifyUser(req.body as VerifyUserRequest);
});

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
    required: ["devicePublicKey", "userId", "message", "signature"],
    properties: {
      devicePublicKey: { type: "string", maxLength: 130, minLength: 88 },
      userId: { type: "string", maxLength: 36, minLength: 36 },
      message: { type: "string", maxLength: 24, minLength: 24 },
      signature: { type: "string", maxLength: 96, minLength: 96 },
    },
  },
};

export default registerUserRoutes;
