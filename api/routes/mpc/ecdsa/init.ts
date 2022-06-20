import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import { db } from "@lib/dev-db";
import { step } from "../step";

export const initGenerateEcdsaKey = (connection: SocketStream) => {
  let context: Context;

  connection.socket.on("message", (message) => {
    if (!context) context = Context.createGenerateEcdsaKey(2);

    const messageServer = new Uint8Array(message as ArrayBuffer);
    console.log("message server", messageServer);

    const stepOutput = step(messageServer, context);

    if (stepOutput === true) {
      const contextBuf = context.toBuffer();

      db.contextBuf = contextBuf;

      connection.socket.close();
    }

    connection.socket.send(JSON.stringify(stepOutput));
  });

  connection.socket.on("error", (err) => {
    console.log("error", err);
  });
};
