import { notFound, other } from "@lib/error";
import { client } from "./../../server";
import { CreateUserRequest, User } from "./user";

export const persistUserCreation = async (
  request: CreateUserRequest
): Promise<User> => {
  const user = await client.user.create({
    data: { ...request },
    include: { keyShares: true },
  });

  if (!user) throw other("Error while creating User");

  return user;
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
    include: { keyShares: true },
  });

  if (!user) throw notFound("User not found");

  return user;
};

type GetUser = {
  userId: string;
  devicePublicKey: string;
};
