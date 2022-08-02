import {
  bitcoinWalletsState,
  BitcoinWalletsState,
  initialBitcoinState,
} from "bitcoin/state/atoms";
import { selector, useSetRecoilState } from "recoil";
import { KeyShareType, PurposeKeyShare } from "shared/types/mpc";
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

export const getPurposeWallet = selector({
  key: "GetPurposeWallet",
  get: ({ get }): PurposeKeyShare => {
    const auth = get<AuthState>(authState);

    const purposeWallet = auth.keyShares.find(
      (wallet) =>
        wallet.parentWalletId === auth.bip44MasterKeyShare.id &&
        wallet.type === KeyShareType.PURPOSE
    );

    if (!purposeWallet) throw new Error("Purpose Wallet does not exist!");

    return purposeWallet;
  },
});
