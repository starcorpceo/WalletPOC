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

type CreateShareMPCHandler<T> = (
  resolve: (value: T) => void,
  reject: (error: MPCError) => void,
  ws: WebSocket,
  genericSecret?: string
) => void;

type ShareActionMPCHandler<T> = (
  resolve: (value: T) => void,
  reject: (error: MPCError) => void,
  ws: WebSocket,
  serverShareId: string,
  clientShare: string,
  ...data: string[]
) => void;

export const authenticatedCreateShareMpc =
  <MPCResult>(
    path: string,
    createShareMPCHandler: CreateShareMPCHandler<MPCResult>
  ) =>
  async (
    devicePublicKey: string,
    userId: string,
    genericSecret?: string
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
      createShareMPCHandler(res, rej, ws, genericSecret);
    });
  };

export const authenticatedShareActionMpc =
  <MPCResult>(
    path: string,
    shareActionMpcHandler: ShareActionMPCHandler<MPCResult>
  ) =>
  async (
    devicePublicKey: string,
    userId: string,
    serverShareId: string,
    clientShare: string,
    ...data: string[]
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
      shareActionMpcHandler(res, rej, ws, serverShareId, clientShare, ...data);
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

export const isSignatureDone = (
  message: WebSocketMessageEvent
): string | undefined => {
  try {
    const msg = JSON.parse(message.data);

    return msg.done;
  } catch (err) {
    return;
  }
};

export const isValidStart = (message: WebSocketMessageEvent) => {
  try {
    const msg = JSON.parse(message.data);

    return msg.value === "Start";
  } catch (err) {
    return;
  }
};

export { deriveBIP32 } from "./deriveBip32";
export { generateEcdsa } from "./generateEcdsa";
export { createGenericSecret } from "./generateSecret";
export { importSecret } from "./importSecret";
export { signEcdsa } from "./signEcdsa";
