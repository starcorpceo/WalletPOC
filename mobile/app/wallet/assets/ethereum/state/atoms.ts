import { EthereumWallet } from "ethereum/types/ethereum";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CoinTypeKeyShare, KeyShareType } from "shared/types/mpc";
import { CustomStorage } from "state/storage";
import { CoinTypeState } from "state/types";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "EthereumWalletsStatePersist",
});

export type EthereumWalletsState = CoinTypeState<EthereumWallet>;

const emptyCoinTypeShare: CoinTypeKeyShare = {
  id: "",
  keyShare: "",
  path: "",
  parentWalletId: "",
  type: KeyShareType.COINTYPE,
};

export const initialEthereumState: EthereumWalletsState = {
  accounts: [],
  coinTypeKeyShare: emptyCoinTypeShare,
};

export const ethereumWalletsState = atom({
  key: "EthereumWallets",
  default: initialEthereumState,
  effects_UNSTABLE: [persistAtom],
});
