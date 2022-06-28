import { other, RouteError } from "@lib/error";
import crypto from "crypto";
import { ResultAsync } from "neverthrow";
import {
  CreateUserRequest,
  CreateUserResponse,
  VerifyUserRequest,
} from "./user";
import { getUser, persistUserCreation } from "./user.repository";

export const createUser = (
  request: CreateUserRequest
): ResultAsync<CreateUserResponse, RouteError> => {
  return ResultAsync.fromPromise(persistUserCreation(request), (e) =>
    other("Err while creating user", e as Error)
  ).map((user) => {
    return {
      nonce: crypto.randomBytes(16).toString("base64"),
      userId: user.id,
    };
  });
};

export const verifyUser = (
  request: VerifyUserRequest
): ResultAsync<boolean, RouteError> => {
  const { message, signature } = request;

  return ResultAsync.fromPromise(getUser(request), (e) => e as RouteError).map(
    (user) => {
      const verifier = crypto.createVerify("SHA256").update(message, "utf-8");
      const result = verifier.verify(
        {
          key: buildPubKey(user.devicePublicKey),
          format: "pem",
          type: "pkcs1",
        },
        Buffer.from(signature, "base64")
      );
      return result;
    }
  );
};

const buildPubKey = (encoded: string) => {
  // Beginning public key execution
  const l1 = "-----BEGIN PUBLIC KEY-----\n";

  // Finishing public key execution
  const l3 = "\n-----END PUBLIC KEY-----";

  // concatenating all public keys
  return l1 + encoded + l3;
};
