import { Context } from "@crypto-mpc";

const initGenerateEcdsaKey = (message: any) => {
  const context = Context.createGenerateEcdsaKey(2);

  if (context.isFinished) {
    const k1 = context.getNewShare();
    return context.getPublicKey().toString("hex");
  }

  return context.step(message);
};
