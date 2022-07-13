import constants from "@lib/constants";
import { notFound, other } from "@lib/error";
import { client } from "../../server";
import { User } from "./user";
import { Wallet } from "./wallet";

export const deleteWallet = (wallet: Wallet) => {
  return client.wallet.delete({
    where: {
      id: wallet.id,
    },
  });
};

export const createDerivedWallet = (
  user: User,
  share: string,
  parent: Wallet,
  path: string
): Promise<Wallet> => {
  return client.wallet.create({
    data: {
      keyShare: share,
      parentWallet: {
        connect: {
          id: parent.id,
        },
      },
      path,
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

export const createWallet = (
  user: User,
  share: string,
  path: string
): Promise<Wallet> => {
  return client.wallet.create({
    data: {
      keyShare: share,
      path,
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

export const getWallet = async (id: string): Promise<Wallet> => {
  const wallet = await client.wallet.findUnique({
    where: {
      id,
    },
  });

  if (!wallet) throw notFound("No Wallet Found");

  return wallet;
};

export const createBip44PurposeWallet = async (
  user: User,
  parent: Wallet,
  share: string
) => {
  const wallet = await client.wallet.create({
    data: {
      keyShare: share,
      path: constants.bip44MasterIndex,
      user: {
        connect: {
          id_devicePublicKey: {
            id: user.id,
            devicePublicKey: user.devicePublicKey,
          },
        },
      },
      parentWallet: {
        connect: {
          id: parent.id,
        },
      },
      bip44PurposeWallet: {
        create: {
          user: {
            connect: {
              id_devicePublicKey: {
                id: user.id,
                devicePublicKey: user.id,
              },
            },
          },
        },
      },
    },
  });

  if (!wallet) throw other("Error while creating BIP44 Purpose Wallet");

  return wallet;
};

export const createBip44MasterWallet = (
  user: User,
  parent: Wallet,
  share: string
) => {
  const result = client.$transaction([
    client.wallet.delete({
      where: {
        id: parent.id,
      },
    }),
    client.wallet.create({
      data: {
        keyShare: share,
        path: constants.bip44MasterIndex,
        user: {
          connect: {
            id_devicePublicKey: {
              id: user.id,
              devicePublicKey: user.devicePublicKey,
            },
          },
        },
        bip44MasterWallet: {
          create: {
            user: {
              connect: {
                id_devicePublicKey: {
                  id: user.id,
                  devicePublicKey: user.id,
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return result[1];
};
