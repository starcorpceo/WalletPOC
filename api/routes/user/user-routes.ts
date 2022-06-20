import { route } from "@lib/route";
import { FastifyInstance, FastifyRequest, FastifySchema } from "fastify";
import { CreateUserRequest, User } from "./user";
import { createUser } from "./user.service";

const postUser = route<User>((req: FastifyRequest) => {
  return createUser(req.body as CreateUserRequest);
});

const registerUserRoutes = (server: FastifyInstance) => {
  server.post("/user", { schema: createUserSchema }, postUser);
};

const createUserSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["secret"],
    properties: {
      secret: { type: "string", maxLength: 32, minLength: 0 },
    },
  },
};

export default registerUserRoutes;
