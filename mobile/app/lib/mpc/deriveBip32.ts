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
} from ".";

export const deriveBIP32 = authenticatedShareActionMpc<Context>(
  "/mpc/ecdsa/derive",
  (resolve, reject, websocket, serverShareId, secret) => {
    let clientContext: string;
    let deriveStatus: ActionStatus = "Init";

    websocket.onopen = () => {
      websocket.send(serverShareId);
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
          initDeriveBIP32(secret).then((success) => {
            console.log("starting steps for derive");
            success &&
              step(null).then((stepMsg) => websocket.send(stepMsg.message));
          });

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
);
