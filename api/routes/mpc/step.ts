import { Context } from "@crypto-mpc";

export const step = (
  message: Uint8Array,
  context: Context
): number[] | boolean => {
  const inBuff = Buffer.from(message);
  const outBuff = context.step(inBuff);

  const pubKey = context.getPublicKey();

  if (pubKey) {
    console.log("public key, im done here", pubKey);
    return true;
  }

  if (!outBuff) {
    console.log("out buff is not there, error must have occured");
    return false;
  }

  const outUint8 = new Uint8Array(outBuff);

  console.log("last", outUint8);

  return Array.from(outUint8) as number[];
};

export const isError = (
  stepResult: number[] | boolean
): stepResult is boolean => stepResult === true || stepResult === false;
