import { BitcoinWallet } from "bitcoin/controller/bitcoin-wallet";
import { atom } from "recoil";

export type BitcoinWalletsState = BitcoinWallet[];

const initialWalletState: BitcoinWalletsState = [];

export const btcWalletsState = atom({
  key: "btcWallets",
  default: initialWalletState,
});
