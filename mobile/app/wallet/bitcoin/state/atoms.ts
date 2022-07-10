import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "state/storage";
import { BitcoinWallet } from "..";

const { persistAtom } = recoilPersist({ storage: CustomStorage });

export type BitcoinWalletsState = BitcoinWallet[];

const initialWalletState: BitcoinWalletsState = [];

export const bitcoinWalletsState = atom({
  key: "bitcoinWallets",
  default: initialWalletState,
  effects_UNSTABLE: [persistAtom],
});
