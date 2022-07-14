import {
  Bip44MasterWallet,
  Bip44PurposeWallet,
  User as PrismaUser,
  MpcWallet as PrismaWallet,
} from ".prisma/client";
import { notFound, other } from "@lib/error";
import { client } from "./../../server";
import { CreateUserRequest, User } from "./user";

export const persistUserCreation = async (
  request: CreateUserRequest
): Promise<User> => {
  const user = await client.user.create({
    data: { ...request },
    include: includeWallets,
  });

  if (!user) throw other("Error while creating User");

  return prismaUserToUser(user);
};

export const getUser = async (request: GetUser): Promise<User> => {
  const { userId, devicePublicKey } = request;

  const user = await client.user.findUnique({
    where: {
      id_devicePublicKey: {
        id: userId,
        devicePublicKey,
      },
    },
    include: includeWallets,
  });

  if (!user) throw notFound("User not found");

  return prismaUserToUser(user);
};

type GetUser = {
  userId: string;
  devicePublicKey: string;
};

const includeWallets = {
  bip44MasterWallet: {
    include: {
      wallet: true,
    },
  },
  bip44PurposeWallet: {
    include: {
      wallet: true,
    },
  },
  wallets: true,
};

const prismaUserToUser = (user: PrismaWalletUser): User => {
  return {
    ...user,
    bip44MasterWallet: user.bip44MasterWallet?.wallet,
    bip44PurposeWallet: user.bip44PurposeWallet?.wallet,
  };
};

type PrismaWalletUser = PrismaUser & {
  wallets: PrismaWallet[];
  bip44MasterWallet:
    | (Bip44MasterWallet & {
        wallet: PrismaWallet;
      })
    | null;
  bip44PurposeWallet:
    | (Bip44PurposeWallet & {
        wallet: PrismaWallet;
      })
    | null;
};
