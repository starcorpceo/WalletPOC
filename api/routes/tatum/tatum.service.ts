import { notFound, other, RouteError } from "@lib/error";
import { ResultAsync } from "neverthrow";
import {
  CreateTatumConnectionRequest,
  CreateTatumConnectionResponse,
  GetTatumConnectionRequest,
  GetTatumConnectionResponse,
} from "./tatum";
import {
  findAccountAddressToTatumId,
  persistAccountAddressToTatumIdCreation,
} from "./tatum.repository";

export const createTatumConnection = (
  request: CreateTatumConnectionRequest
): ResultAsync<CreateTatumConnectionResponse, RouteError> => {
  return ResultAsync.fromPromise(
    persistAccountAddressToTatumIdCreation(request),
    (e) => other("Err while creating Tatum connection", e as Error)
  ).map(() => {
    return { created: true };
  });
};

export const findTatumConnection = (
  request: GetTatumConnectionRequest
): ResultAsync<GetTatumConnectionResponse, RouteError> => {
  return ResultAsync.fromPromise(findAccountAddressToTatumId(request), (e) =>
    notFound(
      (e as Error).message || "Unexpected Error while finding Tatum connection"
    )
  ).map((tatumConnection) => {
    return { tatumId: tatumConnection.tatumId };
  });
};
