import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { SecretWallet, User } from "../../user/user";
import { getSecretWallet } from "../../user/wallet.repository";
import { ActionStatus } from "../mpc-routes";
import { finishBySavingShare } from "../step/share";
import { step } from "../step/step";

export const deriveBIP32 = async (connection: SocketStream, user: User) => {
  let context: Context;
  let status: ActionStatus = "Init";

  let secret: SecretWallet;

  connection.socket.on("message", async (message) => {
    switch (status) {
      case "Init":
        try {
          secret = await getSecretWallet(message.toString());
          status = "Stepping";
          connection.socket.send(JSON.stringify({ value: "Start" }));
        } catch (err) {
          logger.error({ err }, "Error while initiating derive");
          connection.socket.close();
          return;
        }
        break;
      case "Stepping":
        {
          context =
            context ||
            Context.createDeriveBIP32Context(
              2,
              Buffer.from(secret.genericSecret, "base64"),
              0,
              0
            );

          const stepOutput = step(message.toString(), context);

          if (stepOutput === true) {
            finishBySavingShare(user, context, connection);
            return;
          }

          if (stepOutput === false) return;

          connection.socket.send(stepOutput as string);
        }
        break;
    }
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "Error on derive BIP32");
  });
};
