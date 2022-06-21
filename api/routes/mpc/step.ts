import { Context } from "@crypto-mpc";

export const step = (
  message: Uint8Array,
  context: Context
): number[] | boolean => {
  const inBuff = Buffer.from(message);

  try {
    const outBuff = context.step(inBuff);

    if (context.isFinished()) {
      console.log("Steps for current actions are completed");
      return true;
    }

    if (!outBuff) {
      console.log("out buff is not there, error must have occured");
      return false;
    }

    const outUint8 = new Uint8Array(outBuff);

    return Array.from(outUint8) as number[];
  } catch (err) {
    console.log("Error while performing step", err);
  }

  return false;
};

export const isError = (
  stepResult: number[] | boolean
): stepResult is boolean => stepResult === true || stepResult === false;
