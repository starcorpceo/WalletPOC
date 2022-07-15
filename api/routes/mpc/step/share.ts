import { SocketStream } from "@fastify/websocket";
import constants from "@lib/constants";
import logger from "@lib/logger";
import Context from "../../../crypto-mpc-js/lib/context";
import { User } from "../../user/user";
import { MPCWallet } from "../../user/wallet";
import {
  createBip44MasterWallet,
  createBip44PurposeWallet,
  createDerivedWallet,
  createWallet,
} from "../../user/wallet.repository";
import { DeriveConfig } from "../ecdsa/deriveBIP32";

export const processDerivedShare = async (
  user: User,
  share: string,
  parent: MPCWallet,
  connection: SocketStream,
  deriveConfig: DeriveConfig
) => {
  try {
    const { path, id: serverShareId } = await saveDerivedShare(
      user,
      share,
      parent,
      deriveConfig
    );

    connection.socket.send(JSON.stringify({ done: true, serverShareId, path }));
    connection.socket.close();
  } catch (err) {
    logger.error({ err }, "Error while saving Derived Share");
    connection.socket.close();
  }
};

const saveDerivedShare = async (
  user: User,
  share: string,
  parent: MPCWallet,
  deriveConfig: DeriveConfig
): Promise<MPCWallet> => {
  const wallet = await saveShareBasedOnPath(user, share, parent, deriveConfig);

  logger.info(
    {
      ...wallet,
      keyShare: wallet.keyShare?.slice(0, 23),
    },
    "Wallet main key derived"
  );

  return wallet;
};

const saveShareBasedOnPath = (
  user: User,
  share: string,
  parent: MPCWallet,
  deriveConfig: DeriveConfig
): Promise<MPCWallet> => {
  const path = buildPath(deriveConfig);

  switch (deriveConfig.index) {
    case constants.bip44MasterIndex:
      return createBip44MasterWallet(user, parent, share, path);
    case constants.bip44PurposeIndex:
      return createBip44PurposeWallet(user, parent, share, path);
    default:
      return createDerivedWallet(user, share, parent, path);
  }
};

const buildPath = (deriveConfig: DeriveConfig) => {
  const { parentPath, index, hardened } = deriveConfig;

  if (!parentPath && index === "m") return "m";

  return `${parentPath}/${index}${hardened === "1" && "'"}`;
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
