import { Context } from "@crypto-mpc";
import { other } from "@lib/error";
import { route } from "@lib/route";
import { FastifyRequest } from "fastify";
import { ResultAsync } from "neverthrow";

type GenerateEcdsaKeyRequest = {
  message: number[];
};

export const initGenerateEcdsaKey = route<number[]>((req: FastifyRequest) => {
  const { message } = JSON.parse(req.body as string);

  return ResultAsync.fromPromise(
    new Promise((resolve) => {
      resolve(nativeInitGenerateEcdsaKey(message));
    }),
    (err) =>
      other("Error while generating ecdsa key in native code", err as Error)
  );
});

const nativeInitGenerateEcdsaKey = (message: number[]): number[] => {
  const context = Context.createGenerateEcdsaKey(2);

  if (context.isFinished()) {
    const k1 = context.getNewShare();

    return context.getPublicKey().toString("hex");
  }

  const bufferTemp = Buffer.from(Uint8Array.of(...message).buffer);

  const uintRes = new Uint8Array(context.step(bufferTemp));

  return Array.from(uintRes) as number[];
};
