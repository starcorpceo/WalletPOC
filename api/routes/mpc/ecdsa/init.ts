import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import { User, Wallets } from "../../user/user";
import { createWallet } from "../../user/wallets.repository";
import { step } from "../step";

export const initGenerateEcdsaKey = (connection: SocketStream, user: User) => {
  let context: Context;

  connection.socket.on("message", (message) => {
    if (!context) context = Context.createGenerateEcdsaKey(2);

    const stepOutput = step(message.toString(), context);

    if (stepOutput === true) {
      createWallet(user, context.getNewShare().toString("base64"))
        .then((wallets: Wallets) =>
          console.log("user created", {
            ...wallets,
            mainShare: wallets.mainShare.slice(0, 23),
          })
        )
        .catch((e) => console.error("Error while creating wallet", e));

      connection.socket.close();
      return;
    }

    connection.socket.send(stepOutput as string);
  });

  connection.socket.on("error", (err) => {
    console.log("error", err);
  });
};
