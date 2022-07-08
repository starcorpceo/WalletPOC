import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import Context from "../../../crypto-mpc-js/lib/context";
import { User } from "../../user/user";
import { createWalletBySecret } from "../../user/wallet.repository";

export const finishBySavingGenericSecret = async (
  user: User,
  context: Context,
  connection: SocketStream
) => {
  try {
    const wallet = await createWalletBySecret(
      user,
      context.getNewShare().toString("base64")
    );

    logger.info(
      {
        ...wallet,
        genericSecret: wallet.genericSecret?.slice(0, 23),
      },
      "Generic Secret Created"
    );

    connection.socket.send(
      JSON.stringify({ done: true, serverShareId: wallet.id })
    );
    connection.socket.close();
  } catch (err) {
    logger.error({ err }, "Error while saving generic Secret from generate");
    connection.socket.close();
  }
};
