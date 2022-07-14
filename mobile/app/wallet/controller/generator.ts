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

export const generateCryptoWallet = async <T extends CryptoWallet>(
  parent: Wallet,
  user: User,
  index: string,
  hardened: boolean,
  pubKeyTransformer: PubKeyToWalletConfig<T>
): Promise<T> => {
  return await deriveToCryptoWallet<T>(
    parent,
    user,
    index,
    hardened,
    pubKeyTransformer
  );
};

export type PubKeyToWalletConfig<T extends CryptoWallet> = (
  publicKey: string
) => T;

export const generateMpcWalletFromSeed = async (
  seed: string,
  user: User
): Promise<Wallet> => {
  const share = await importSecret(user.devicePublicKey, user.id, seed);

  return await deriveToMpcWallet(
    secretShareToMpcWallet(share),
    user,
    constants.bip44MasterIndex,
    false
  );
};

export const generateMpcWallet = async (user: User): Promise<Wallet> => {
  const share = await createGenericSecret(user.devicePublicKey, user.id);

  return deriveToMpcWallet(
    secretShareToMpcWallet(share),
    user,
    constants.bip44MasterIndex,
    false
  );
};

const deriveToCryptoWallet = async <T extends CryptoWallet>(
  parent: Wallet,
  user: User,
  index: string,
  hardened: boolean,
  pubKeyToWalletConfig: PubKeyToWalletConfig<T>
): Promise<T> => {
  const context = await deriveBIP32NoLocalAuth(
    user.devicePublicKey,
    user.id,
    parent.id,
    parent.keyShare,
    index,
    hardened ? "1" : "0",
    parent.path
  );

  const derivedShare = await getResultDeriveBIP32(context.clientContext);
  return pubKeyToWalletConfig(await getPublicKey(derivedShare));
};

export const deriveToMpcWallet = async (
  parent: Wallet,
  user: User,
  index: string,
  hardened: boolean
): Promise<Wallet> => {
  const context = await deriveBIP32NoLocalAuth(
    user.devicePublicKey,
    user.id,
    parent.id,
    parent.keyShare,
    index,
    hardened ? "1" : "0",
    parent.path
  );

  const derivedShare = await getResultDeriveBIP32(context.clientContext);

  return {
    keyShare: derivedShare,
    id: context.deriveResult.serverShareId,
    path: context.deriveResult.path,
    parentWalletId: null,
  };
};

const secretShareToMpcWallet = (share: Share): Wallet => {
  return {
    id: share.serverShareId,
    keyShare: share.clientShare,
    path: "",
    parentWalletId: null,
  };
};