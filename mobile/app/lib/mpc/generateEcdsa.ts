import { signWithDeviceKey } from "lib/auth";
import { fetchFromApi, getApiUrl } from "lib/http";
import { initGenerateEcdsaKey, step } from "react-native-blockchain-crypto-mpc";
import { CreateNonceResponse } from "../../api-types/auth";

export const generateEcdsa = async (
  devicePublicKey: string,
  userId: string
): Promise<string> => {
  const { nonce } = await fetchFromApi<CreateNonceResponse>("/getNonce");

  const deviceSignature = await signWithDeviceKey(nonce);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      getApiUrl("ws") + "/mpc/ecdsa/generateEcdsa",
      undefined,
      {
        headers: {
          userId,
          devicePublicKey,
          deviceSignature,
        },
      }
    );

    ws.onopen = () => {
      console.log("Start generate ecdsa key");
      initGenerateEcdsaKey().then((success) => {
        if (success)
          step(null).then((stepMsg) => {
            ws.send(stepMsg.message);
          });
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      step(message.data).then((stepMsg) => {
        ws.send(stepMsg.message);

        stepMsg.finished && stepMsg.share && resolve(stepMsg.share);
      });
    };

    ws.onerror = (error) => {
      reject(error);
    };
  });
};
