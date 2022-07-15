import {
  bitcoinWalletsState,
  BitcoinWalletsState,
  initialBitcoinState,
} from "bitcoin/state/atoms";
import { selector, useSetRecoilState } from "recoil";
import { AuthState, authState } from "./atoms";

type AllWallets = {
  account: AuthState;
  bitcoin: BitcoinWalletsState;
};

export const useResetWalletState = () => {
  const setBitcoinState =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  return function WithAllCoinStates() {
    setBitcoinState((_) => ({ ...initialBitcoinState }));
  };
};

export const getAllWallets = selector({
  key: "GetAllWalletsSelector",
  get: ({ get }): AllWallets => {
    return {
      bitcoin: get<BitcoinWalletsState>(bitcoinWalletsState),
      account: get<AuthState>(authState),
    };
  },
});
