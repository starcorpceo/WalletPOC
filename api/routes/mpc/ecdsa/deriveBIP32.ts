import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { User } from "../../user/user";
import { Wallet } from "../../user/wallet";
import { getWallet } from "../../user/wallet.repository";
import { ActionStatus } from "../mpc-routes";
import { saveShareAsChildOfParentWallet } from "../step/share";
import { step } from "../step/step";

export const deriveBIP32 = async (connection: SocketStream, user: User) => {
  let context: Context;
  let status: ActionStatus = "Init";

  let parent: Wallet;

  connection.socket.on("message", async (message) => {
    switch (status) {
      case "Init":
        try {
          parent = await getWallet(message.toString());
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
          const share = parent.genericSecret || parent.mainShare;

          context =
            context ||
            Context.createDeriveBIP32Context(
              2,
              Buffer.from(share as string, "base64"),
              0,
              0
            );

          const stepOutput = step(message.toString(), context);

          if (stepOutput === true) {
            saveShareAsChildOfParentWallet(user, context, parent, connection);
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
