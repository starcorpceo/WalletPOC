import { BitcoinWallets } from "bitcoin/controller/bitcoin-wallet";
import { atom } from "recoil";

export type BitcoinWalletsState = BitcoinWallets[];

const initialWalletState: BitcoinWalletsState = [];

export const bitcoinWalletsState = atom({
  key: "btcWallets",
  default: initialWalletState,
});
