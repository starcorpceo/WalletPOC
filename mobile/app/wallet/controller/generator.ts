// ToDo's
// derive not only from bitcoin
// derive several wallets

import constants from "config/constants";
import { createGenericSecret, importSecret, Share } from "lib/mpc";
import { deriveBIP32NoLocalAuth } from "lib/mpc/deriveBip32";
import {
  getPublicKey,
  getResultDeriveBIP32,
} from "react-native-blockchain-crypto-mpc";
import "shim";
import { User } from "../../api-types/user";
import { Wallet } from "../../api-types/wallet";
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

export const generateMpcWalletFromSeed = async (
  seed: string,
  user: User
): Promise<Wallet> => {
  const share = await importSecret(user.devicePublicKey, user.id, seed);

  return await deriveToMpcWallet(share, user, constants.bip44MasterIndex);
};

export const generateMpcWallet = async (
  user: User,
  path: string
): Promise<Wallet> => {
  const share = await createGenericSecret(user.devicePublicKey, user.id);

  return deriveToMpcWallet(share, user, path);
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

const deriveToMpcWallet = async (
  share: Share,
  user: User,
  path: string
): Promise<Wallet> => {
  const context = await deriveBIP32NoLocalAuth(
    user.devicePublicKey,
    user.id,
    share.serverShareId,
    share.clientShare
  );

  const derivedShare = await getResultDeriveBIP32(context.clientContext);

  return {
    keyShare: derivedShare,
    id: context.serverShareId,
    path,
    parentWalletId: null,
  };
};
