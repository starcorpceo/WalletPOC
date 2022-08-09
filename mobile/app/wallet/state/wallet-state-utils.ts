import { bitcoinWalletsState, BitcoinWalletsState, initialBitcoinState } from "bitcoin/state/atoms";
import { selector, useSetRecoilState } from "recoil";
import { authState, AuthState } from "state/atoms";
import { Address, Balance, CoinTypeAccount } from "wallet/types/wallet";

type AllWallets = {
  account: AuthState;
  bitcoin: BitcoinWalletsState;
};

export const useResetWalletState = () => {
  const setBitcoinState = useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

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

export const useAddAddress = (state: any) => {
  const setCoinState = useSetRecoilState(state);

  return function ToCoinState(address: Address[], account: CoinTypeAccount, changeType: "internal" | "external") {
    const index =
      account.mpcKeyShare.path.slice(-1) === "'"
        ? Number(account.mpcKeyShare.path.slice(-2).slice(0, 1))
        : Number(account.mpcKeyShare.path.slice(-1));

    setCoinState((current: any) => {
      return {
        ...current,
        accounts: [
          {
            ...current.accounts[index],
            [changeType]: {
              ...current.accounts[index][changeType],
              addresses: [...current.accounts[index][changeType].addresses, ...address],
            },
          },
        ],
      };
    });
  };
};

export const useUpdateAccountBalance = (state: any) => {
  const setCoinState = useSetRecoilState(state);

  return function ToCoinState(balance: Balance, account: CoinTypeAccount) {
    const index =
      account.mpcKeyShare.path.slice(-1) === "'"
        ? Number(account.mpcKeyShare.path.slice(-2).slice(0, 1))
        : Number(account.mpcKeyShare.path.slice(-1));

    setCoinState((current: any) => {
      return {
        ...current,
        accounts: [
          {
            ...current.accounts[index],
            balance,
          },
        ],
      };
    });
  };
};
