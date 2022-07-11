/**
 * Deriving a wallet based on previous seed
 */

import {
  getPublicKey,
  getResultDeriveBIP32,
  initDeriveBIP32,
  step,
} from "react-native-blockchain-crypto-mpc";
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

/**
 * What works:
 * Derive Non-Hardened from secret with index = 0
 * Derive Hardened from Share with index != 0
 */
function deriveHandler(
  resolve: (value: Context) => void,
  reject: (error: MPCError) => void,
  websocket: WebSocket,
  serverShareId: string,
  secret: string,
  index = "0",
  hardened = "0"
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
        initDeriveBIP32(secret, Number(index), Number(hardened) === 1).then(
          (success) => {
            console.log("starting steps for derive");
            success &&
              step(null).then((stepMsg) => {
                if (stepMsg.finished && stepMsg.context) {
                  getResultDeriveBIP32(stepMsg.context).then((res) => {
                    getPublicKey(res).then((res2) =>
                      console.log("resulting public key", res2)
                    );

                    console.log("resultingshare", res);
                  });

                  clientContext = stepMsg.context;
                  // resolve({serverShareId: undefined, clientContext: stepMsg.context});
                  return;
                }

                console.log(stepMsg);
                websocket.send(stepMsg.message);
              });
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

/**
 *
 * Special method for non hardend derive from existing share, because it only needs 1 step on the client side
 */
function deriveFromShareNonHardened(share: string, index: string) {
  return new Promise((resolve) => {
    initDeriveBIP32(share, Number(index), false).then((success) => {
      success &&
        step(null).then((stepMsg) => {
          if (stepMsg.finished && stepMsg.context) {
            resolve(stepMsg.context);
          }
        });
    });
  });
}
