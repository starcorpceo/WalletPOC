import { notFound, other } from "@lib/error";
import { client } from "../../server";
import { SecretWallet, User, Wallet } from "./user";

// Create by Share directly, this will be obsolete at some point
export const createWalletByShare = (
  user: User,
  share: string
): Promise<Wallet> => {
  return client.wallet.create({
    data: {
      mainShare: share,
      user: {
        connect: {
          id_devicePublicKey: {
            id: user.id,
            devicePublicKey: user.devicePublicKey,
          },
        },
      },
    },
  });
};

export const createWalletBySecret = (
  user: User,
  secret: string
): Promise<Wallet> => {
  return client.wallet.create({
    data: {
      genericSecret: secret,
      user: {
        connect: {
          id_devicePublicKey: {
            id: user.id,
            devicePublicKey: user.devicePublicKey,
          },
        },
      },
    },
  });
};

export const getWalletForSecret = async (id: string): Promise<SecretWallet> => {
  const wallet = await client.wallet.findUnique({
    where: {
      id,
    },
  });

  if (!wallet) throw notFound("No Wallet Found");

  if (wallet.genericSecret === null)
    throw other(
      "Wallet was fetched for working with genericSecret but Wallet does not have generic secret"
    );

  return wallet as SecretWallet;
};

export const getWallet = async (id: string): Promise<Wallet> => {
  const wallet = await client.wallet.findUnique({
    where: {
      id,
    },
  });

  if (!wallet) throw notFound("No Wallet Found");

  return wallet;
};
