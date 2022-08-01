import {
  bitcoinWalletsState,
  BitcoinWalletsState,
  initialBitcoinState,
} from "bitcoin/state/atoms";
import { selector, selectorFamily, useSetRecoilState } from "recoil";
import { MPCWallet } from "../api-types/wallet";
import { AuthState, authState } from "./atoms";

type AllWallets = {
  account: AuthState;
  bitcoin: BitcoinWalletsState;
};

export const useResetWalletState = () => {
  const setBitcoinState =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  return function WithAllCoinStates() {
    setBitcoinState((_) => ({ ...initialBitcoinState, accounts: [] }));
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

export const getPurposeWallet = selectorFamily({
  key: "GetPurposeWallet",
  get:
    (params: { masterId: string; purposeIndex: string }) =>
    ({ get }): MPCWallet => {
      const { masterId, purposeIndex } = params;

      const auth = get<AuthState>(authState);
      console.log(
        "finding fromthis auth",
        auth,
        masterId,
        "m/" + purposeIndex + "'"
      );
      const purposeWallet = auth.wallets.find(
        (wallet) =>
          wallet.parentWalletId === masterId &&
          wallet.path === "m/" + purposeIndex + "'"
      );

      if (!purposeWallet) throw new Error("Purpose Wallet does not exist!");

      return purposeWallet;
    },
});
