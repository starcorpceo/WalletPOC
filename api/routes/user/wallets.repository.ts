import { client } from "./../../server";
import { User, Wallets } from "./user";

export const createWallet = (user: User, share: string): Promise<Wallets> => {
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
