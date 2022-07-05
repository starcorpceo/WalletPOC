import { notFound } from "@lib/error";
import { client } from "../../server";
import { CreateUserRequest, User } from "./user";

export const persistUserCreation = (
  request: CreateUserRequest
): Promise<User> => {
  return client.user.create({ data: { ...request } });
};

export const getUser = async (request: GetUser): Promise<User> => {
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

type GetUser = {
  userId: string;
  devicePublicKey: string;
};
