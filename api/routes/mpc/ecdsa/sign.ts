import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { ShareWallet } from "../../user/user";
import { getShareWallet } from "../../user/wallet.repository";
import { step } from "../step/step";

type SignStatus = "InitShare" | "InitMessage" | "Stepping";

export const signWithEcdsaShare = (connection: SocketStream) => {
  let context: Context;
  let status: SignStatus = "InitShare";

  let share: ShareWallet;

  connection.socket.on("message", async (message) => {
    switch (status) {
      case "InitShare":
        try {
          share = await getShareWallet(message.toString());
          status = "InitMessage";
          connection.socket.send(JSON.stringify({ value: "ShareSet" }));
        } catch (err) {
          logger.error({ err }, "Error while initiating signing");
          connection.socket.close();
          return;
        }
        break;

      case "InitMessage":
        try {
          context =
            context ||
            Context.createEcdsaSignContext(
              2,
              Buffer.from(share.mainShare, "base64"),
              message,
              true
            );

          connection.socket.send(JSON.stringify({ value: "Start" }));

          status = "Stepping";
        } catch (err) {
          logger.error({ err }, "Error while starting signature");
          connection.socket.close();
        }
        break;
      case "Stepping":
        {
          const stepOutput = step(message.toString(), context);

          if (stepOutput === true) {
            logger.info("Completed Signature, closing connection");
            connection.socket.close();
            return;
          }

          connection.socket.send(stepOutput);
        }
        break;
    }
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "error");
  });
};
