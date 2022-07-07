import { initGenerateEcdsaKey, step } from "react-native-blockchain-crypto-mpc";
import { authenticatedMpc, getServerShareId, Share } from ".";

export const generateEcdsa = authenticatedMpc<Share>(
  "/mpc/ecdsa/generateEcdsa",
  (resolve, reject, websocket) => {
    let clientShare: string;

    websocket.onopen = () => {
      console.log("Start generate ecdsa key");
      initGenerateEcdsaKey().then((success) => {
        if (success)
          step(null).then((stepMsg) => {
            websocket.send(stepMsg.message);
          });
      });
    };

    websocket.onmessage = (message: WebSocketMessageEvent) => {
      const serverShareId = getServerShareId(message);

      if (serverShareId && clientShare) {
        resolve({ clientShare, serverShareId });
        return;
      }

      step(message.data).then((stepMsg) => {
        websocket.send(stepMsg.message);

        if (stepMsg.finished && stepMsg.share) clientShare = stepMsg.share;
      });
    };

    websocket.onerror = (error) => {
      reject(error);
    };
  }
);
