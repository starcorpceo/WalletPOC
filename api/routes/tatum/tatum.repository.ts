import { notFound, other } from "@lib/error";
import { client } from "./../../server";
import { CreateTatumConnectionRequest, TatumConnection } from "./tatum";

export const persistAccountAddressToTatumIdCreation = async (
  request: CreateTatumConnectionRequest
): Promise<TatumConnection> => {
  const tatumConnection = await client.accountAddressToTatumId.create({
    data: { ...request },
  });

  if (!tatumConnection) throw other("Error while creating Tatum Connection");

  return tatumConnection;
};

export const findAccountAddressToTatumId = async (
  request: FindTatumConnection
): Promise<TatumConnection> => {
  const { accountAddress } = request;

  const tatumConnection = await client.accountAddressToTatumId.findFirst({
    where: {
      accountAddress: accountAddress,
    },
  });

  if (!tatumConnection) throw new Error("No tatum connection for this address");

  return tatumConnection;
};

type FindTatumConnection = {
  accountAddress: string;
};
