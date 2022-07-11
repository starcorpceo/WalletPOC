/**
 * Deriving a wallet based on previous seed
 */

import { initDeriveBIP32, step } from "react-native-blockchain-crypto-mpc";
import {
  ActionStatus,
  authenticatedShareActionMpc,
  Context,
  getServerShareId,
  isValidStart,
  MPCError,
} from ".";

export const deriveBIP32 = authenticatedShareActionMpc<Context>(
  "/mpc/ecdsa/derive",
  deriveHandler
);

export const deriveBIP32NoLocalAuth = authenticatedShareActionMpc<Context>(
  "/mpc/ecdsa/derive",
  deriveHandler,
  false
);

function deriveHandler(
  resolve: (value: Context) => void,
  reject: (error: MPCError) => void,
  websocket: WebSocket,
  serverShareId: string,
  secret: string,
  index: string,
  hardened: string
) {
  let clientContext: string;
  let deriveStatus: ActionStatus = "Init";

  websocket.onopen = () => {
    websocket.send(
      JSON.stringify({
        serverShareId,
        index,
        hardened,
      })
    );
  };

  websocket.onmessage = (message: WebSocketMessageEvent) => {
    switch (deriveStatus) {
      case "Init":
        if (!isValidStart(message)) {
          websocket.close();
          reject(
            new Error(
              "Something went wrong when starting up derive communication"
            )
          );
          return;
        }

        deriveStatus = "Stepping";
        initDeriveBIP32(secret, Number(index), Boolean(hardened)).then(
          (success) => {
            console.log("starting steps for derive");
            success &&
              step(null).then((stepMsg) => websocket.send(stepMsg.message));
          }
        );

        break;

      case "Stepping":
        const serverShareId = getServerShareId(message);

        if (serverShareId && clientContext) {
          resolve({ clientContext, serverShareId });
          return;
        }

        console.log("derive message from server");
        step(message.data).then((stepMsg) => {
          websocket.send(stepMsg.message);

          if (stepMsg.finished && stepMsg.context)
            clientContext = stepMsg.context;
        });
    }
  };

  websocket.onerror = (error) => {
    reject(error);
  };
}
