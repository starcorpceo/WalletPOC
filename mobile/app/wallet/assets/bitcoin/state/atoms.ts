import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CoinTypeKeyShare, KeyShareType } from "shared/types/mpc";
import { CustomStorage } from "state/storage";
import { CoinTypeState } from "state/types";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "BitcoinWalletsStatePersist",
});

export type BitcoinWalletsState = CoinTypeState<BitcoinWallet>;

const emptyCoinTypeShare: CoinTypeKeyShare = {
  id: "",
  keyShare: "",
  path: "",
  parentWalletId: "",
  type: KeyShareType.COINTYPE,
};

export const initialBitcoinState: BitcoinWalletsState = {
  accounts: [],
  coinTypeKeyShare: emptyCoinTypeShare,
};

export const bitcoinWalletsState = atom({
  key: "BitcoinWallets",
  default: initialBitcoinState,
  effects_UNSTABLE: [persistAtom],
});
