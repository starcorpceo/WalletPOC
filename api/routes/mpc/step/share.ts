import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import Context from "../../../crypto-mpc-js/lib/context";
import { User } from "../../user/user";
import { createWalletByShare } from "../../user/wallet.repository";

export const finishBySavingShare = async (
  user: User,
  context: Context,
  connection: SocketStream
) => {
  try {
    const wallet = await createWalletByShare(
      user,
      context.getNewShare().toString("base64")
    );

    logger.info(
      {
        ...wallet,
        mainShare: wallet.mainShare?.slice(0, 23),
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
