import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { User, Wallet } from "../../user/user";
import { createWalletByShare } from "../../user/wallets.repository";
import { step } from "../step";

export const generateEcdsaKey = (connection: SocketStream, user: User) => {
  let context: Context;

  connection.socket.on("message", (message) => {
    if (!context) context = Context.createGenerateEcdsaKey(2);

    const stepOutput = step(message.toString(), context);

    if (stepOutput === true) {
      createWalletByShare(user, context.getNewShare().toString("base64"))
        .then((wallets: Wallet) =>
          logger.info(
            {
              ...wallets,
              mainShare: wallets.mainShare?.slice(0, 23),
            },
            "Wallet main key saved from Ecdsa Init"
          )
        )
        .catch((err) =>
          logger.error({ err }, "Error while saving main key from Ecdas Init")
        );

      connection.socket.close();
      return;
    }

    connection.socket.send(stepOutput as string);
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "Error on Init Ecdsa Websocket");
  });
};
