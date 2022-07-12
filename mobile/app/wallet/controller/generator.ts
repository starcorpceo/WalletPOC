// ToDo's
// derive not only from bitcoin
// derive several wallets

import { createGenericSecret, importSecret, Share } from "lib/mpc";
import { deriveBIP32NoLocalAuth } from "lib/mpc/deriveBip32";
import {
  getPublicKey,
  getResultDeriveBIP32,
} from "react-native-blockchain-crypto-mpc";
import "shim";
import { User } from "../../api-types/user";
import { ShareWallet } from "../../api-types/wallet";
import { CryptoWallet } from "../wallet";

export const generateCryptoWalletFromSeed = async <T extends CryptoWallet>(
  seed: string,
  user: User,
  pubKeyTransformer: PubKeyToWalletConfig<T>
): Promise<T> => {
  const share = await importSecret(user.devicePublicKey, user.id, seed);
  return await deriveToCryptoWallet(share, user, pubKeyTransformer);
};

export const generateCryptoWallet = async <T extends CryptoWallet>(
  user: User,
  pubKeyTransformer: PubKeyToWalletConfig<T>
): Promise<T> => {
  const share = await createGenericSecret(user.devicePublicKey, user.id);
  return await deriveToCryptoWallet<T>(share, user, pubKeyTransformer);
};

export type PubKeyToWalletConfig<T extends CryptoWallet> = (
  publicKey: string
) => T;

export const generateAccountWalletFromSeed = async (
  seed: string,
  user: User
): Promise<ShareWallet> => {
  const share = await importSecret(user.devicePublicKey, user.id, seed);

  return await deriveToAccountWallet(share, user);
};

export const generateAccountWallet = async (
  user: User
): Promise<ShareWallet> => {
  const share = await createGenericSecret(user.devicePublicKey, user.id);

  return deriveToAccountWallet(share, user);
};

const deriveToCryptoWallet = async <T extends CryptoWallet>(
  share: Share,
  user: User,
  pubKeyToWalletConfig: PubKeyToWalletConfig<T>
): Promise<T> => {
  const context = await deriveBIP32NoLocalAuth(
    user.devicePublicKey,
    user.id,
    share.serverShareId,
    share.clientShare
  );

  const derivedShare = await getResultDeriveBIP32(context.clientContext);
  return pubKeyToWalletConfig(await getPublicKey(derivedShare));
};

const deriveToAccountWallet = async (
  share: Share,
  user: User
): Promise<ShareWallet> => {
  const context = await deriveBIP32NoLocalAuth(
    user.devicePublicKey,
    user.id,
    share.serverShareId,
    share.clientShare
  );

  const derivedShare = await getResultDeriveBIP32(context.clientContext);

  return {
    share: derivedShare,
    id: context.serverShareId,
    parentWalletId: null,
    genericSecret: null,
  };
};
