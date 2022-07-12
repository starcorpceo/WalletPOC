import { bitcoinWalletsState, BitcoinWalletsState } from "bitcoin/state/atoms";
import { selector, useRecoilCallback } from "recoil";
import { AuthState, authState } from "./atoms";

type AllWallets = {
  account: AuthState;
  bitcoin: BitcoinWalletsState;
};

export const useResetWalletState = () =>
  useRecoilCallback(({ set }) => () => {
    set(bitcoinWalletsState, (_current: BitcoinWalletsState) => []);
  });

export const getAllWallets = selector({
  key: "GetAllWalletsSelector",
  get: ({ get }): AllWallets => {
    return {
      bitcoin: get<BitcoinWalletsState>(bitcoinWalletsState),
      account: get<AuthState>(authState),
    };
  },
});
