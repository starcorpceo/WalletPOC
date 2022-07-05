/**
 * Generating an random MPC seed(secret) for deriving later
 *
 * @param {Function} setSeedShare Function to return the client side seed share
 */

import { getApiUrl } from "lib/http";
import {
  initGenerateGenericSecret,
  step,
} from "react-native-blockchain-crypto-mpc";

export const generateSecret = (): Promise<string> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApiUrl("ws") + "/secret");

    ws.onopen = () => {
      initGenerateGenericSecret().then((success) => {
        success && step(null).then((stepMsg) => ws.send(stepMsg.message));
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      step(message.data).then((stepMsg) => {
        ws.send(stepMsg.message);

        stepMsg.finished && stepMsg.share && res(stepMsg.share);
      });
    };

    ws.onerror = (error) => {
      console.log("err", error);
    };
  });
};
