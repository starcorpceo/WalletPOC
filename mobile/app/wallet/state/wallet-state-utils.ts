import { bitcoinWalletsState, BitcoinWalletsState, initialBitcoinState } from "bitcoin/state/atoms";
import { EthereumWalletsState, ethereumWalletsState, initialEthereumState } from "ethereum/state/atoms";
import { selector, useSetRecoilState } from "recoil";
import { authState, AuthState } from "state/atoms";
import { Address, Balance, CoinTypeAccount } from "wallet/types/wallet";

type AllWallets = {
  account: AuthState;
  bitcoin: BitcoinWalletsState;
};

export const useResetWalletState = () => {
  const setBitcoinState = useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);
  const setEthereumState = useSetRecoilState<EthereumWalletsState>(ethereumWalletsState);

  return function WithAllCoinStates() {
    setBitcoinState((_) => ({ ...initialBitcoinState, accounts: [] }));
    setEthereumState((_) => ({ ...initialEthereumState, accounts: [] }));
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
    const index = getAccountIndex(account);
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
    const index = getAccountIndex(account);
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

/**
 * Get the index of account - index is the bip44 path - account part
 * @param account
 * @returns
 */
const getAccountIndex = (account: CoinTypeAccount): number => {
  return account.mpcKeyShare.path.slice(-1) === "'"
    ? Number(account.mpcKeyShare.path.slice(-2).slice(0, 1))
    : Number(account.mpcKeyShare.path.slice(-1));
};
