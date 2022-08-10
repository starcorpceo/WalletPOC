import { User } from "api-types/user";
import { Transaction, TxData } from "ethereumjs-tx";
import { ECDSASignature } from "ethereumjs-util";
import { ethers } from "ethers";
import { signEcdsa } from "lib/mpc";
import { getBinSignature } from "react-native-blockchain-crypto-mpc";
import { Address } from "wallet/types/wallet";

export const buildRawTransaction = async (
  from: Address,
  user: User,
  to: string,
  value: number,
  txCount: number,
  gasPrice = 2000,
  gasLimit = 21000
): Promise<Transaction> => {
  const txData: TxData = {
    nonce: ethers.utils.hexlify(txCount),
    to,
    value: value,
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    v: Buffer.from([]),
    r: Buffer.from([]),
    s: Buffer.from([]),
  };
  const tx = new Transaction(txData, { chain: "goerli" });

  const msgHash = tx.hash(false);

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

  const sig: ECDSASignature = {
    r: sigBuff.slice(0, 32),
    s: sigBuff.slice(32, 64),
    v: recoveryCode + 27 + tx.getChainId() * 2 + 8,
  };

  Object.assign(tx, sig);

  return tx;
};
