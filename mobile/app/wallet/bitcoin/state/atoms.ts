import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "state/storage";
import { BitcoinWallet } from "..";

const { persistAtom } = recoilPersist({ storage: CustomStorage });

export type BitcoinWalletsState = BitcoinWallet[];

export const initialBitcoinState: BitcoinWalletsState = [];

export const bitcoinWalletsState = atom({
  key: "bitcoinWallets",
  default: initialBitcoinState,
  effects_UNSTABLE: [persistAtom],
});
