import { EthereumWallet } from "ethereum/types/ethereum";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "state/storage";
import { CoinTypeState } from "state/types";
import { initialCoinState } from "wallet/state/wallet-state-utils";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "EthereumWalletsStatePersist",
});

export type EthereumWalletsState = CoinTypeState<EthereumWallet>;

export const ethereumWalletsState = atom({
  key: "EthereumWallets",
  default: initialCoinState,
  effects_UNSTABLE: [persistAtom],
});
