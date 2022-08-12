import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "state/storage";
import { CoinTypeState } from "state/types";
import { initialCoinState } from "wallet/state/wallet-state-utils";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "BitcoinWalletsStatePersist",
});

export type BitcoinWalletsState = CoinTypeState<BitcoinWallet>;

export const bitcoinWalletsState = atom({
  key: "BitcoinWallets",
  default: initialCoinState,
  effects_UNSTABLE: [persistAtom],
});
