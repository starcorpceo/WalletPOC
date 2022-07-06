import { client } from "./../../server";
import { User, Wallets } from "./user";

// Create by Share directly, this will be obsolete at some point
export const createWalletByShare = (
  user: User,
  share: string
): Promise<Wallets> => {
  return client.wallets.create({
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
): Promise<Wallets> => {
  return client.wallets.create({
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
