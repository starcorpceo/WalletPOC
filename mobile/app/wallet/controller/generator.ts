import constants from "config/constants";
import { createGenericSecret, importSecret, Share } from "lib/mpc";
import { deriveBIP32NoLocalAuth } from "lib/mpc/deriveBip32";
import {
  getPublicKey,
  getResultDeriveBIP32,
} from "react-native-blockchain-crypto-mpc";
import "shim";
import { User } from "../../api-types/user";
import { MPCWallet } from "../../api-types/wallet";
import { CryptoWallet } from "../wallet";

export type MPCWalletToWalletConfig<T extends CryptoWallet> = (
  MPCWallet: MPCWallet
) => Promise<T>;

export const generateMpcWalletFromSeed = async (
  seed: string,
  user: User
): Promise<MPCWallet> => {
  const share = await importSecret(user.devicePublicKey, user.id, seed);

  return await deriveToMpcWallet(
    secretShareToMpcWallet(share),
    user,
    constants.bip44MasterIndex,
    false
  );
};

export const generateMpcWallet = async (user: User): Promise<MPCWallet> => {
  const share = await createGenericSecret(user.devicePublicKey, user.id);

  return deriveToMpcWallet(
    secretShareToMpcWallet(share),
    user,
    constants.bip44MasterIndex,
    false
  );
};

export const deriveToMpcWallet = async (
  parent: MPCWallet,
  user: User,
  index: string,
  hardened: boolean
): Promise<MPCWallet> => {
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

const secretShareToMpcWallet = (share: Share): MPCWallet => {
  return {
    id: share.serverShareId,
    keyShare: share.clientShare,
    path: "",
    parentWalletId: null,
  };
};
