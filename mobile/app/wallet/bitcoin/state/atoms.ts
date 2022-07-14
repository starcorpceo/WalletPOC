import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "state/storage";
import { BitcoinWallet } from "..";
import { MPCWallet } from "../../../api-types/wallet";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "BitcoinWalletsStatePersist",
});

export type BitcoinWalletsState = {
  coinTypeWallet: MPCWallet | undefined;
  accounts: BitcoinWallet[];
};

export const initialBitcoinState: BitcoinWalletsState = {
  accounts: [],
  coinTypeWallet: undefined,
};

export const bitcoinWalletsState = atom({
  key: "bitcoinWallets",
  default: initialBitcoinState,
  effects_UNSTABLE: [persistAtom],
});
