export interface Wallet {
  id: string;
  mainShare: string | null;
  genericSecret: string | null;
  parentWalletId: string | null;
}

/**
 * extends Wallet is not totally clean. It is not really extending the Wallet type
 * but rather specifying that the optional value genericSecret is not optional in a SecretWallet
 *  */
export interface SecretWallet extends Wallet {
  id: string;
  genericSecret: string;
}

/**
 * extends Wallet is not totally clean. It is not really extending the Wallet type
 * but rather specifying that the optional value mainShare is not optional in a ShareWallet
 *  */
export interface ShareWallet extends Wallet {
  id: string;
  mainShare: string;
}
