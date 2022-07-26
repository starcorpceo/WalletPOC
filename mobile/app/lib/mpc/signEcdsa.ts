import {
  getSignature,
  initSignEcdsa,
  step,
} from "react-native-blockchain-crypto-mpc";
import { authenticatedShareActionMpc, isValidStart } from ".";

type SignStatus = "InitShare" | "InitMessage" | "Stepping";

export const signEcdsa = authenticatedShareActionMpc<string>(
  "/mpc/ecdsa/sign",
  (
    resolve,
    reject,
    websocket,
    serverShareId,
    clientShare,
    messageToSign,
    encoding
  ) => {
    let signStatus: SignStatus = "InitShare";

    websocket.onopen = () => {
      websocket.send(serverShareId);

      signStatus = "InitMessage";
    };

    websocket.onmessage = (message: WebSocketMessageEvent) => {
      switch (signStatus) {
        case "InitMessage":
          websocket.send(JSON.stringify({ messageToSign, encoding }));

          signStatus = "Stepping";

          break;

        case "Stepping":
          if (isValidStart(message)) {
            initSignEcdsa(
              new Uint8Array(
                Buffer.from(messageToSign, encoding as BufferEncoding)
              ),
              clientShare
            ).then((success) => {
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
