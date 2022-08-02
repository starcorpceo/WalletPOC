export interface MPCKeyShare {
  id: string;
  keyShare: string;
  type: KeyShareType;
}

export interface MPCEcdsaKeyShare extends MPCKeyShare {
  path: string;
  parentWalletId: string;
}

export interface SecretKeyShare
  extends Omit<MPCKeyShare, "path" | "parentWalletId"> {}

type MasterKeyShare = MPCKeyShare & {
  path: string;
};

export interface PurposeKeyShare extends MPCEcdsaKeyShare {}

export interface CoinTypeKeyShare extends MPCEcdsaKeyShare {}

export interface AccountKeyShare extends MPCEcdsaKeyShare {}

export interface ChangeKeyShare extends MPCEcdsaKeyShare {}

export interface AddressKeyShare extends MPCEcdsaKeyShare {}

export enum KeyShareType {
  SECRET,
  MASTER,
  PURPOSE,
  COINTYPE,
  ACCOUNT,
  CHANGE,
  ADDRESS,
}
