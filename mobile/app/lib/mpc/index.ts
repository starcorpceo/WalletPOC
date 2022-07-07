import { signWithDeviceKey } from "lib/auth";
import { fetchFromApi, getApiUrl } from "lib/http";
import { CreateNonceResponse } from "../../api-types/auth";

export type Share = {
  clientShare: string;
  serverShareId: string;
};
export type Context = {
  clientContext: string;
  serverShareId: string;
};

export type MPCResult = Share | Context | void;

export type ActionStatus = "Init" | "Stepping";

// TODO give this some type in order to make sense
export type MPCError = any;

type MPCHandler<T> = (
  resolve: (value: T) => void,
  reject: (error: MPCError) => void,
  ws: WebSocket,
  ...args: string[]
) => void;

type MPCShareHandler<T> = (
  resolve: (value: T) => void,
  reject: (error: MPCError) => void,
  ws: WebSocket,
  serverShareId: string,
  ...args: string[]
) => void;

export const authenticatedMpc =
  <MPCResult>(path: string, mpcHandler: MPCHandler<MPCResult>) =>
  async (
    devicePublicKey: string,
    userId: string,
    ...args: string[]
  ): Promise<MPCResult> => {
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
      mpcHandler(res, rej, ws, ...args);
    });
  };

export const authenticatedShareMpc =
  <MPCResult>(path: string, mpcHandler: MPCShareHandler<MPCResult>) =>
  async (
    devicePublicKey: string,
    userId: string,
    serverShareId: string,
    ...args: string[]
  ): Promise<MPCResult> => {
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
      mpcHandler(res, rej, ws, serverShareId, ...args);
    });
  };

export const getServerShareId = (
  message: WebSocketMessageEvent
): string | undefined => {
  try {
    const msg = JSON.parse(message.data);

    return msg.serverShareId;
  } catch (err) {
    return;
  }
};

export const isValidStart = (message: WebSocketMessageEvent) => {
  const msg = JSON.parse(message.data);

  return msg.value === "Start";
};

export { deriveBIP32 } from "./deriveBip32";
export { generateEcdsa } from "./generateEcdsa";
export { createGenericSecret } from "./generateSecret";
export { importSecret } from "./importSecret";
export { signEcdsa } from "./signEcdsa";
