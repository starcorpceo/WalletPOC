// ToDo's
// derive not only from bitcoin
// derive several wallets

import Elliptic from "elliptic";
import { createGenericSecret, importSecret, Share } from "lib/mpc";
import { deriveBIP32NoLocalAuth } from "lib/mpc/deriveBip32";
import {
  getPublicKey,
  getResultDeriveBIP32,
} from "react-native-blockchain-crypto-mpc";
import "shim";
import { User } from "../api-types/user";
import { IWallet } from "./wallet";
const ec = new Elliptic.ec("secp256k1");

export const generateWalletFromSeed = async <T extends IWallet>(
  seed: string,
  user: User,
  pubKeyTransformer: PubKeyToWalletConfig<T>
): Promise<T> => {
  const share = await importSecret(user.devicePublicKey, user.id, seed);
  console.log("got share", share);

  return await derive<T>(share, user, pubKeyTransformer);
};

export const generateWallet = async <T extends IWallet>(
  user: User,
  pubKeyTransformer: PubKeyToWalletConfig<T>
): Promise<T> => {
  console.log("generating new wallet...");
  const share = await createGenericSecret(user.devicePublicKey, user.id);
  return await derive<T>(share, user, pubKeyTransformer);
};

const derive = async <T extends IWallet>(
  share: Share,
  user: User,
  pubKeyBufToWalletConfig: PubKeyToWalletConfig<T>
): Promise<T> => {
  const context = await deriveBIP32NoLocalAuth(
    user.devicePublicKey,
    user.id,
    share.serverShareId,
    share.clientShare
  );

  const derivedShare = await getResultDeriveBIP32(context.clientContext);
  const derivedPubKey = await getPublicKey(derivedShare);

  const ecPair = ec.keyFromPublic(
    [...Buffer.from(derivedPubKey, "base64")].slice(23)
  );

  const pubkeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");

  return pubKeyBufToWalletConfig(pubkeyBuf);
};

export type PubKeyToWalletConfig<T extends IWallet> = (publicKey: Buffer) => T;
