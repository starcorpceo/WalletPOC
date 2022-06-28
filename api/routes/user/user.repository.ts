import { notFound } from "@lib/error";
import { client } from "../../server";
import { CreateUserRequest, User, VerifyUserRequest } from "./user";

export const persistUserCreation = (
  request: CreateUserRequest
): Promise<User> => {
  return client.user.create({ data: { ...request } });
};

export const getUser = async (request: VerifyUserRequest): Promise<User> => {
  const { userId, devicePublicKey } = request;

  const user = await client.user.findUnique({
    where: {
      id_devicePublicKey: {
        id: userId,
        devicePublicKey,
      },
    },
  });

  if (!user) throw notFound("User not found");

  return user;
};
