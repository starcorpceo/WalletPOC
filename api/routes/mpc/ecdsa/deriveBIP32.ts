import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { RawData } from "ws";
import { User } from "../../user/user";
import { getWallet } from "../../user/wallet.repository";
import { ActionStatus } from "../mpc-routes";
import { processDerivedShare } from "../step/share";
import { step } from "../step/step";

export const deriveBIP32 = async (connection: SocketStream, user: User) => {
  let status: ActionStatus = "Init";

  connection.socket.on("message", async (message: RawData) => {
    let deriveContext;
    switch (status) {
      case "Init":
        deriveContext = await initDerive(message, connection);
        status = "Stepping";

        break;
      case "Stepping":
        deriveStep(message, deriveContext, user, connection);
        break;
    }
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "Error on derive BIP32");
  });
};

const initDerive = async (message: RawData, connection: SocketStream) => {
  try {
    const deriveConfig = JSON.parse(message.toString()) as DeriveConfig;

    const parent = await getWallet(deriveConfig.serverShareId);

    const context = Context.createDeriveBIP32Context(
      2,
      Buffer.from(parent.keyShare as string, "base64"),
      Number(deriveConfig.index),
      Number(deriveConfig.hardened) === 1
    );

    connection.socket.send(JSON.stringify({ value: "Start" }));

    return { deriveConfig, parent, context };
  } catch (err) {
    logger.error({ err }, "Error while initiating Derive Bip32");
    connection.socket.close();
    return;
  }
};

const deriveStep = async (
  message: RawData,
  deriveContext,
  user: User,
  connection: SocketStream
) => {
  try {
    const { context, parent, deriveConfig } = deriveContext;

    const stepOutput = step(message.toString(), context);

    if (stepOutput === true) {
      processDerivedShare(
        user,
        context.getNewShare().toString("base64"),
        parent,
        connection,
        buildPath(deriveConfig)
      );
      return;
    }

    if (stepOutput === false) return;

    connection.socket.send(stepOutput as string);
  } catch (err) {
    logger.error({ err }, "Error while Performing Derive Steps");
  }
};

type DeriveConfig = {
  serverShareId: string;
  index: string;
  hardened: string;
  parentPath: string;
};

const buildPath = (deriveConfig: DeriveConfig) => {
  const { parentPath, index, hardened } = deriveConfig;

  if (!parentPath && index === "m") return "m";

  return `${parentPath}/${index}${hardened && "'"}`;
};
