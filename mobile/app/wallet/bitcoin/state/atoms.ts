import { atom } from "recoil";
import { BitcoinWallet } from "..";

export type BitcoinWalletsState = BitcoinWallet[];

const initialWalletState: BitcoinWalletsState = [];

export const bitcoinWalletsState = atom({
  key: "btcWallets",
  default: initialWalletState,
});
