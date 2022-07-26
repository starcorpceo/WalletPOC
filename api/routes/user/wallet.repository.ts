import { notFound, other } from "@lib/error";
import { client } from "../../server";
import { User } from "./user";
import { MPCWallet } from "./wallet";

export const deleteWallet = (wallet: MPCWallet) => {
  return client.mpcWallet.delete({
    where: {
      id: wallet.id,
    },
  });
};

export const createDerivedWallet = (
  user: User,
  share: string,
  parent: MPCWallet,
  path: string
): Promise<MPCWallet> => {
  return client.mpcWallet.create({
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
): Promise<MPCWallet> => {
  return client.mpcWallet.create({
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

export const getWallet = async (id: string): Promise<MPCWallet> => {
  const wallet = await client.mpcWallet.findUnique({
    where: {
      id,
    },
  });
  if (!wallet) throw notFound("No Wallet Found");

  return wallet;
};

export const createBip44MasterWallet = async (
  user: User,
  parent: MPCWallet,
  share: string,
  path: string
): Promise<MPCWallet> => {
  try {
    const result = await client.$transaction([
      client.mpcWallet.delete({
        where: {
          id: parent.id,
        },
      }),
      client.mpcWallet.create({
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
          bip44MasterWallet: {
            create: {
              user: {
                connect: {
                  id_devicePublicKey: {
                    id: user.id,
                    devicePublicKey: user.devicePublicKey,
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const master = result[1];

    if (!master) throw other("Error while creating BIP44 Master Wallet");

    return master;
  } catch (err) {
    await client.mpcWallet.delete({
      where: {
        id: parent.id,
      },
    });
    throw err;
  }
};
