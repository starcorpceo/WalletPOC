import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import Context from "../../../crypto-mpc-js/lib/context";
import { User, Wallets } from "../../user/user";
import { createWalletBySecret } from "../../user/wallets.repository";
import { step } from "../step";

export const generateGenericSecret = (connection: SocketStream, user: User) => {
  let context: Context;

  connection.socket.on("message", (message) => {
    if (!context) context = Context.createGenerateGenericSecretContext(2, 256);

    const stepOutput = step(message.toString(), context);

    if (stepOutput === true) {
      createWalletBySecret(user, context.getNewShare().toString("base64"))
        .then((wallets: Wallets) =>
          logger.info(
            {
              ...wallets,
              secret: wallets.genericSecret?.slice(0, 23),
            },
            "Wallet main key saved from Ecdsa Init"
          )
        )
        .catch((err) =>
          logger.error(
            { err },
            "Error while saving generic Secret from generate"
          )
        );

      connection.socket.close();
      return;
    }

    connection.socket.send(stepOutput as string);
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "error");
  });
};
