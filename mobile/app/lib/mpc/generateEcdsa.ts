import { initGenerateEcdsaKey, step } from "react-native-blockchain-crypto-mpc";
import { authenticatedMpc } from "./shared";

export const generateEcdsa = authenticatedMpc<string>(
  (resolve, reject, websocket) => {
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
      step(message.data).then((stepMsg) => {
        websocket.send(stepMsg.message);

        stepMsg.finished && stepMsg.share && resolve(stepMsg.share);
      });
    };

    websocket.onerror = (error) => {
      reject(error);
    };
  }
);
