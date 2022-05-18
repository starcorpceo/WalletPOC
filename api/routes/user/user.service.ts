import { other, RouteError } from "@lib/error";
import { ResultAsync } from "neverthrow";
import { CreateUserRequest, User } from "./user";
import { persistUserCreation } from "./user.repository";

export const createUser = (
  request: CreateUserRequest
): ResultAsync<User, RouteError> =>
  ResultAsync.fromPromise(persistUserCreation(request), (e) =>
    other("Err while creating user", e as Error)
  );
