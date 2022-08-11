import { User } from "api-types/user";
import { Transaction } from "ethereumjs-tx";
import { signEcdsa } from "lib/mpc";
import { getBinSignature } from "react-native-blockchain-crypto-mpc";
import { Address } from "wallet/types/wallet";

export const getSignedRawTransaction = async (user: User, from: Address, transaction: Transaction): Promise<string> => {
  const msgHash = transaction.hash(false);

  const context = await signEcdsa(
    user.devicePublicKey,
    user.id,
    from.keyShare.id,
    from.keyShare.keyShare,
    msgHash.toString("base64"),
    "base64"
  );

  const { signature, recoveryCode } = await getBinSignature(context, from.keyShare.keyShare);

  const sigBuff = Buffer.from(signature, "base64");

  const sig = {
    r: sigBuff.slice(0, 32),
    s: sigBuff.slice(32, 64),
    v: recoveryCode + 27 + transaction.getChainId() * 2 + 8,
  };

  Object.assign(transaction, sig);

  return "0x" + transaction.serialize().toString("hex");
};
