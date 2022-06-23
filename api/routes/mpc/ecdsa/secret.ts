import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import { db } from "@lib/dev-db";
import { step } from "../step";

export const initGenerateGenericSecret = (connection: SocketStream) => {
  let context: Context;

  connection.socket.on("message", (message) => {
    if (!context) context = Context.createGenerateGenericSecretContext(2, 256);

    const messageFromClient = new Uint8Array(message as ArrayBuffer);

    const stepOutput = step(messageFromClient, context);

    if (stepOutput === true) {
      // TODO: Remove this in favor of real database
      db.shareBuf = context.getNewShare();
      console.log("share ", db.shareBuf);

      connection.socket.close();
    }

    connection.socket.send(JSON.stringify(stepOutput));
  });

  connection.socket.on("error", (err) => {
    console.log("error", err);
  });
};

export const importGenericSecret = (connection: SocketStream) => {
  let context: Context;

  connection.socket.on("message", (message) => {
    
    const messageFromClient = new Uint8Array(message as ArrayBuffer);

    if (!context) context = Context.createImportGenericSecretContext(2, 256, message as ArrayBuffer);

    const stepOutput = step(messageFromClient, context);

    if (stepOutput === true) {
      // TODO: Remove this in favor of real database
      db.shareBuf = context.getNewShare();

      connection.socket.close();
    }

    connection.socket.send(JSON.stringify(stepOutput));
  });

  connection.socket.on("error", (err) => {
    console.log("error", err);
  });
};