import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import Context from "../../../crypto-mpc-js/lib/context";
import { User } from "../../user/user";
import { processLastStep } from "../step/secret";
import { step } from "../step/step";

export const generateGenericSecret = (connection: SocketStream, user: User) => {
  let context: Context;

  connection.socket.on("message", (message) => {
    if (!context) context = Context.createGenerateGenericSecretContext(2, 256);

    const stepOutput = step(message.toString(), context);

    if (stepOutput === true) {
      processLastStep(user, context, connection);
      return;
    }

    connection.socket.send(stepOutput as string);
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "error");
  });
};
