/**
 * Generating an random MPC seed(secret) for deriving later
 *
 * @param {Function} setSeedShare Function to return the client side seed share
 */

import {
  initGenerateGenericSecret,
  step,
} from "react-native-blockchain-crypto-mpc";
import { authenticatedMpc, Share } from "./shared";

export const createGenericSecret = authenticatedMpc<Share>(
  "/mpc/ecdsa/generateSecret",
  (resolve, reject, websocket) => {
    websocket.onopen = () => {
      console.log("open  secret message");

      initGenerateGenericSecret().then((success) => {
        success &&
          step(null).then((stepMsg) => {
            websocket.send(stepMsg.message);
            stepMsg.finished && stepMsg.share && resolve(stepMsg.share);
          });
      });
    };

    // This action only requires one step. No onMessage event is needed

    websocket.onerror = (error) => {
      reject(error);
    };

    websocket.onclose = (e) => {};
  }
);
