import { client1 } from "../..";
import { CreateUserRequest, User } from "./user";

export const persistUserCreation = (
  request: CreateUserRequest
): Promise<User> => {
  return client1.user.create({ data: { ...request } });
};
