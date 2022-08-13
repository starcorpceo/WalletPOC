import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { Psbt } from "der-bitcoinjs-lib";
import { BitcoinBalance } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import { RecoilState, useSetRecoilState } from "recoil";
import { CoinTypeState } from "state/types";
import { getAccountIndex } from "wallet/state/wallet-state-utils";
import { CoinTypeAccount } from "wallet/types/wallet";

export const useUpdateAccountBalance = (state: any) => {
  const setCoinState = useSetRecoilState(state);

  return function ToCoinState(balance: BitcoinBalance, account: CoinTypeAccount) {
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

export const useAddMempoolTransaction = <T extends CoinTypeAccount>(state: RecoilState<CoinTypeState<T>>) => {
  const setCoinState = useSetRecoilState(state);

  return function ToCoinState(transaction: Psbt, account: BitcoinWallet) {
    const index = getAccountIndex(account);
    setCoinState((current: any) => {
      return {
        ...current,
        accounts: [
          {
            ...current.accounts[index],
            mempool: [...current.accounts[index].mempool, transaction],
          },
        ],
      };
    });
  };
};

export const useDeleteMempoolTransaction = <T extends CoinTypeAccount>(state: RecoilState<CoinTypeState<T>>) => {
  const setCoinState = useSetRecoilState(state);

  return function ToCoinState(deleteIndex: number, account: BitcoinWallet) {
    const index = getAccountIndex(account);
    setCoinState((current: any) => {
      return {
        ...current,
        accounts: [
          {
            ...current.accounts[index],
            mempool: [
              ...current.accounts[index].mempool.slice(0, deleteIndex),
              ...current.accounts[index].mempool.slice(deleteIndex + 1),
            ],
          },
        ],
      };
    });
  };
};
