import { Buffer } from "buffer";
import {
  getSignature,
  initSignEcdsa,
  step,
} from "react-native-blockchain-crypto-mpc";
import { authenticatedShareMpc, isValidStart } from ".";

type SignStatus = "InitShare" | "InitMessage" | "Stepping";

export const signEcdsa = authenticatedShareMpc<string>(
  "/mpc/ecdsa/sign",
  (resolve, reject, websocket, serverShareId, share, messageToSign) => {
    let signStatus: SignStatus = "InitShare";

    websocket.onopen = () => {
      websocket.send(serverShareId);

      signStatus = "InitMessage";
    };

    websocket.onmessage = (message: WebSocketMessageEvent) => {
      switch (signStatus) {
        case "InitMessage":
          websocket.send(Buffer.from(messageToSign));

          signStatus = "Stepping";

          break;

        case "Stepping":
          if (isValidStart(message)) {
            initSignEcdsa(messageToSign, share).then((success) => {
              success &&
                step(null).then((stepMsg) => websocket.send(stepMsg.message));
            });
            return;
          }

          step(message.data).then(async (stepMsg) => {
            websocket.send(stepMsg.message);

            stepMsg.finished &&
              stepMsg.context &&
              resolve(await getSignature(stepMsg.context));
          });

          break;
      }
    };

    websocket.onerror = (error) => {
      console.log("err", error);
    };
  }
);
