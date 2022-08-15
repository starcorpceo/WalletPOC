import { EthereumWallet } from "ethereum/types/ethereum";
import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import { RecoilState, useSetRecoilState } from "recoil";
import { CoinTypeState } from "state/types";
import { getAccountIndex } from "wallet/state/wallet-state-utils";
import { CoinTypeAccount } from "wallet/types/wallet";

export const useAddMempoolTransaction = <T extends CoinTypeAccount>(state: RecoilState<CoinTypeState<T>>) => {
  const setCoinState = useSetRecoilState(state);

  return function ToCoinState(transaction: EthereumTransaction, account: EthereumWallet) {
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

  return function ToCoinState(deleteIndex: number, account: EthereumWallet) {
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
