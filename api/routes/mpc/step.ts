import { Context } from "@crypto-mpc";

export const step = (message: string, context: Context): string | boolean => {
  const inBuff = Buffer.from(message, "base64");

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

    return outBuff.toString("base64");
  } catch (err) {
    console.log("Error while performing step", err);
  }

  return false;
};

export const isError = (
  stepResult: number[] | boolean
): stepResult is boolean => stepResult === true || stepResult === false;
