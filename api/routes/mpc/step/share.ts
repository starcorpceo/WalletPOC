import { SocketStream } from "@fastify/websocket";
import constants from "@lib/constants";
import logger from "@lib/logger";
import Context from "../../../crypto-mpc-js/lib/context";
import { User } from "../../user/user";
import { Wallet } from "../../user/wallet";
import {
  createBip44MasterWallet,
  createBip44PurposeWallet,
  createDerivedWallet,
  createWallet,
} from "../../user/wallet.repository";

export const processDerivedShare = async (
  user: User,
  share: string,
  parent: Wallet,
  connection: SocketStream,
  path: string
) => {
  try {
    const serverShareId = saveDerivedShare(user, share, parent, path);
    connection.socket.send(JSON.stringify({ done: true, serverShareId }));
    connection.socket.close();
  } catch (err) {
    logger.error({ err }, "Error while saving Derived Share");
    connection.socket.close();
  }
};

const saveDerivedShare = async (
  user: User,
  share: string,
  parent: Wallet,
  path: string
): Promise<string> => {
  const wallet = await saveShareBasedOnPath(user, share, parent, path);

  logger.info(
    {
      ...wallet,
      keyShare: wallet.keyShare?.slice(0, 23),
    },
    "Wallet main key derived"
  );

  return wallet.id;
};

const saveShareBasedOnPath = (
  user: User,
  share: string,
  parent: Wallet,
  path: string
): Promise<Wallet> => {
  switch (path) {
    case constants.bip44MasterIndex:
      return createBip44MasterWallet(user, parent, share);
    case constants.bip44PurposeIndex:
      return createBip44PurposeWallet(user, parent, share);
    default:
      return createDerivedWallet(user, share, parent, path);
  }
};

export const saveShare = async (
  user: User,
  context: Context,
  connection: SocketStream
) => {
  try {
    const wallet = await createWallet(
      user,
      context.getNewShare().toString("base64"),
      "ecdsa"
    );

    logger.info(
      {
        ...wallet,
        keyShare: wallet.keyShare?.slice(0, 23),
      },
      "Wallet main key derived"
    );

    connection.socket.send(
      JSON.stringify({ done: true, serverShareId: wallet.id })
    );
    connection.socket.close();
  } catch (err) {
    logger.error({ err }, "Error while saving main key from Ecdas Init");
    connection.socket.close();
  }
};
