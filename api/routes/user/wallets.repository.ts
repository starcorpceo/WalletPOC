import { client } from "./../../server";
import { User, Wallet } from "./user";

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
