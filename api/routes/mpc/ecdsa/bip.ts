import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import { db } from "@lib/dev-db";
import { step } from "../step";

export const initDeriveBIP32 = (connection: SocketStream) => {
  let context: Context;

  console.log("yepp heere");

  connection.socket.on("message", (message) => {

    const share = db.shareBuf;
    if (!context) context = Context.createDeriveBIP32Context(2, share, 0, 0);

    console.log("Something will be done");

    const messageFromClient = new Uint8Array(message as ArrayBuffer);

    const stepOutput = step(messageFromClient, context);

    if (stepOutput === true) {
      // TODO: Remove this in favor of real database
      db.shareBuf = context.getNewShare();
      console.log("everthings done");

      connection.socket.close();
    }

    if(stepOutput === false)
        return

    connection.socket.send(JSON.stringify((stepOutput as number[])));
  });

  connection.socket.on("error", (err) => {
    console.log("error", err);
  });
};
