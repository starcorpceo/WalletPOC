import { User } from "api-types/user";
import { Address } from "wallet/types/wallet";
import * as bitcoin from "der-bitcoinjs-lib";
import "shim";
import { signEcdsa } from "lib/mpc";

export const prepareSingleSigner = (user: User, address: Address): bitcoin.SignerAsync => {
  const ec: bitcoin.SignerAsync = {
    publicKey: address.publicKey as Buffer,
    sign: async (hash: Buffer) =>
      Buffer.from([
        ...Buffer.from(
          await signEcdsa(
            user.devicePublicKey,
            user.id,
            address.keyShare.id,
            address.keyShare.keyShare,
            hash.toString("base64"),
            "base64"
          ),
          "base64"
        ),
        0x01,
      ]),
  };
  return ec;
};

export const signAllInputs = async (
  preparedTransaction: bitcoin.Psbt,
  preparedSigners: bitcoin.SignerAsync[]
): Promise<bitcoin.Psbt> => {
  for (let i = 0; i < preparedSigners.length; i++) {
    await preparedTransaction.signInputAsync(i, preparedSigners[i]);
  }
  const validated = preparedTransaction.validateSignaturesOfAllInputs();
  preparedTransaction.finalizeAllInputs();
  return preparedTransaction;
};
