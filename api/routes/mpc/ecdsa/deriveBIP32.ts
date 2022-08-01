import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { RawData } from "ws";
import { User } from "../../user/user";
import { MPCWallet } from "../../user/wallet";
import { getWallet } from "../../user/wallet.repository";
import { ActionStatus } from "../mpc-routes";
import { processDerivedShare } from "../step/share";
import { step } from "../step/step";

export const deriveBIP32 = async (connection: SocketStream, user: User) => {
  let status: ActionStatus = "Init";
  let deriveContext: DeriveContext;

  connection.socket.on("message", async (message: RawData) => {
    switch (status) {
      case "Init":
        deriveContext = await initDerive(message, connection);
        status = "Stepping";
        return;
      case "Stepping":
        {
          const input = message.toString();

          if (input === "nonhardened") {
            const share = deriveContext.context
              .getResultDeriveBIP32()
              .toBuffer()
              .toString("base64");

            processDerivedShare(
              user,
              share,
              deriveContext.parent,
              connection,
              deriveContext.deriveConfig
            );

            return;
          }

          deriveStep(message, deriveContext, user, connection);
        }
        return;
    }
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "Error on derive BIP32");
    deriveContext?.context?.free();
  });

  connection.socket.on("close", (code, reason) => {
    logger.info(
      { code, reason: reason?.toString() },
      "Closed Derive BIP32 Connection"
    );
    deriveContext?.context?.free();
  });
};

const initDerive = async (
  message: RawData,
  connection: SocketStream
): Promise<DeriveContext> => {
  try {
    const deriveConfig = JSON.parse(message.toString()) as DeriveConfig;

    const parent = await getWallet(deriveConfig.serverShareId);

    const context = Context.createDeriveBIP32Context(
      2,
      Buffer.from(parent.keyShare as string, "base64"),
      Number(deriveConfig.hardened) === 1,
      Number(deriveConfig.index)
    );

    connection.socket.send(JSON.stringify({ value: "Start" }));

    return { deriveConfig, parent, context };
  } catch (err) {
    logger.error({ err }, "Error while initiating Derive Bip32");
    connection.socket.close(undefined, "Error while initiating Derive Bip32");
    throw err;
  }
};

const deriveStep = async (
  message: RawData,
  deriveContext: DeriveContext,
  user: User,
  connection: SocketStream
) => {
  try {
    const { context, parent, deriveConfig } = deriveContext;

    const stepInput = message.toString();

    const stepOutput = step(stepInput, context);

    if (stepOutput === true) {
      const share = context.getNewShare().toString("base64");

      processDerivedShare(user, share, parent, connection, deriveConfig)
        .then((_) => context.free())
        .catch((err) => {
          logger.error({ err }, "Error while Storing Derived Share");
          context.free();
        });

      return;
    }

    if (stepOutput === false) return;

    connection.socket.send(stepOutput as string);
  } catch (err) {
    logger.error({ err }, "Error while Performing Derive Steps");
    deriveContext.context?.free();
  }
};

export type DeriveConfig = {
  serverShareId: string;
  index: string;
  hardened: string;
  parentPath: string;
};

type DeriveContext = {
  deriveConfig: DeriveConfig;
  parent: MPCWallet;
  context: Context;
};
