import { SocketStream } from "@fastify/websocket";
import { db } from "@lib/dev-db";
import Context from "../../../crypto-mpc-js/lib/context";
import { step } from "../step";

type SignStatus = "Init" | "Stepping";

export const signWithEcdsaShare = (connection: SocketStream) => {
  let context: Context;
  let status: SignStatus = "Init";

  // TODO remove this in favor of real datbase and make sure to *await* the share. Mabye pass the share as parameter to justify the name of the method (...withEcdsaShare)
  const share = db.shareBuf;

  connection.socket.on("message", (message) => {
    switch (status) {
      case "Init":
        console.log("got message on server", message.toString());
        context = Context.createEcdsaSignContext(2, share, message, true);
        status = "Stepping";
        connection.socket.send(JSON.stringify({ value: "Start" }));
        break;
      case "Stepping":
        connection.socket.send(
          JSON.stringify(stepWithMessage(connection, message, context))
        );
        break;
    }
  });

  connection.socket.on("error", (err) => {
    console.log("error", err);
  });
};

const stepWithMessage = (connection, message, context): boolean | number[] => {
  const messageFromClient = new Uint8Array(message as ArrayBuffer);
  const stepOutput = step(messageFromClient, context);

  if (stepOutput === true) {
    db.signature = context.getSignature();

    connection.socket.close();
  }

  return stepOutput;
};
