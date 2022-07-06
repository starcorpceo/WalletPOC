import { signWithDeviceKey } from "lib/auth";
import { fetchFromApi, getApiUrl } from "lib/http";
import { CreateNonceResponse } from "../../api-types/auth";

export type ActionStatus = "Init" | "Stepping";

// TODO give this some type in order to make sense
export type MPCError = any;

type MPCHandler<T> = (
  resolve: (value: T) => void,
  reject: (error: MPCError) => void,
  ws: WebSocket
) => void;

export const authenticatedMpc =
  <T>(mpcHandler: MPCHandler<T>) =>
  async (devicePublicKey: string, userId: string, path: string): Promise<T> => {
    const { nonce } = await fetchFromApi<CreateNonceResponse>("/getNonce");
    const deviceSignature = await signWithDeviceKey(nonce);

    const ws = new WebSocket(getApiUrl("ws") + path, undefined, {
      headers: {
        userId,
        devicePublicKey,
        deviceSignature,
      },
    });

    return new Promise((res, rej) => {
      mpcHandler(res, rej, ws);
    });
  };
