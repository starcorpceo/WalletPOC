import { bitcoinWalletsState, BitcoinWalletsState } from "bitcoin/state/bitcoin-atoms";
import { EthereumWalletsState, ethereumWalletsState } from "ethereum/state/ethereum-atoms";
import { deepCompare } from "lib/util";
import { RecoilState, selector, useSetRecoilState } from "recoil";
import { CoinTypeKeyShare, KeyShareType } from "shared/types/mpc";
import { authState, AuthState } from "state/atoms";
import { CoinTypeState } from "state/types";
import { Address, CoinTypeAccount } from "wallet/types/wallet";

type AllWallets = {
  account: AuthState;
  bitcoin: BitcoinWalletsState;
  ethereum: EthereumWalletsState;
};

const emptyCoinTypeShare: CoinTypeKeyShare = {
  id: "",
  keyShare: "",
  path: "",
  parentWalletId: "",
  type: KeyShareType.COINTYPE,
};

export const initialCoinState: CoinTypeState<CoinTypeAccount> = {
  accounts: [],
  coinTypeKeyShare: emptyCoinTypeShare,
};

export const useResetWalletState = () => {
  const setBitcoinState = useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);
  const setEthereumState = useSetRecoilState<EthereumWalletsState>(ethereumWalletsState);

  return function WithAllCoinStates() {
    setBitcoinState((_) => ({ ...initialCoinState, accounts: [] }));
    setEthereumState((_) => ({ ...initialCoinState, accounts: [] }));
  };
};

export const getAllWallets = selector({
  key: "GetAllWalletsSelector",
  get: ({ get }): AllWallets => {
    return {
      bitcoin: get<BitcoinWalletsState>(bitcoinWalletsState),
      ethereum: get<EthereumWalletsState>(ethereumWalletsState),
      account: get<AuthState>(authState),
    };
  },
});

export const useAddAddress = <T extends CoinTypeAccount>(state: RecoilState<CoinTypeState<T>>) => {
  const setCoinState = useSetRecoilState(state);

  return function ToCoinState(address: Address[], account: CoinTypeAccount, changeType: "internal" | "external") {
    const index = getAccountIndex(account);
    setCoinState((current) => {
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

/**
 * Get the index of account - index is the bip44 path - account part
 * @param account
 * @returns
 */
export const getAccountIndex = (account: CoinTypeAccount): number => {
  return account.mpcKeyShare.path.slice(-1) === "'"
    ? Number(account.mpcKeyShare.path.slice(-2).slice(0, 1))
    : Number(account.mpcKeyShare.path.slice(-1));
};

export const useUpdateAccount = <T extends CoinTypeAccount>(state: RecoilState<CoinTypeState<T>>) => {
  const setCoin = useSetRecoilState<CoinTypeState<T>>(state);

  return function WithSetCoinState(newAccount: T, index: number) {
    setCoin((current) => ({
      ...current,
      accounts: [...current.accounts.slice(0, index), newAccount, ...current.accounts.slice(index + 1)],
    }));
  };
};

export const isStateEmpty = <T extends CoinTypeAccount>(state: CoinTypeState<T>) =>
  deepCompare(state, initialCoinState);
