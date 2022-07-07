/**
 * Importing an seed(secret) - CAVE - single point of failure
 *
 * @param {string} secret Conventional seed, here called secret
 * @param {Function} setSeedShare Function to return the client side seed share
 */

import {
  initImportGenericSecret,
  step,
} from "react-native-blockchain-crypto-mpc";
import { authenticatedMpc, getServerShareId, Share } from ".";

export const importSecret = authenticatedMpc<Share>(
  "/mpc/ecdsa/import",
  (resolve, reject, websocket, secret) => {
    let clientShare: string;

    websocket.onopen = () => {
      websocket.send(secret);
    };

    websocket.onmessage = (message: WebSocketMessageEvent) => {
      const serverShareId = getServerShareId(message);

      if (serverShareId && clientShare) {
        resolve({ clientShare, serverShareId });
        return;
      }

      initImportGenericSecret(secret).then((success) => {
        success &&
          step(null).then((stepMsg) => {
            websocket.send(stepMsg.message);

            if (stepMsg.finished && stepMsg.share) clientShare = stepMsg.share;
          });
      });
    };

    websocket.onerror = (error) => {
      reject(error);
    };
  }
);
