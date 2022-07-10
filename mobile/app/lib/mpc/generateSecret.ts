/**
 * Generating an random MPC seed(secret) for deriving later
 *
 * @param {Function} setSeedShare Function to return the client side seed share
 */

import {
  initGenerateGenericSecret,
  step,
} from "react-native-blockchain-crypto-mpc";
import { authenticatedCreateShareMpc, getServerShareId, Share } from ".";

export const createGenericSecret = authenticatedCreateShareMpc<Share>(
  "/mpc/ecdsa/generateSecret",
  (resolve, reject, websocket) => {
    let clientShare: string;

    websocket.onopen = () => {
      initGenerateGenericSecret().then((success) => {
        success &&
          step(null).then((stepMsg) => {
            websocket.send(stepMsg.message);

            if (stepMsg.finished && stepMsg.share) clientShare = stepMsg.share;
          });
      });
    };

    websocket.onmessage = (message: WebSocketMessageEvent) => {
      const serverShareId = getServerShareId(message);

      if (serverShareId && clientShare) {
        resolve({ clientShare, serverShareId });
        return;
      }
    };

    websocket.onerror = (error) => {
      reject(error);
    };

    websocket.onclose = (e) => {};
  }
);
