import { Factory, ProviderFunctions } from '../../base/factory';
import { Network } from '../../base/types';
import { alchemyEndpoints } from '../../provider/alchemy/ethereum/alchemy-ethereum-endpoints';
import {
  mapAlchemyBalance,
  mapAlchemyResultToString,
  mapAlchemyTransactions,
} from '../../provider/alchemy/ethereum/alchemy-ethereum-mapper';

import {
  AlchemyBalance,
  AlchemyBroadCastTransactionResult,
  AlchemyFees,
  AlchemyTransaction,
  AlchemyTransactionCount,
} from '../../provider/alchemy/ethereum/alchemy-ethereum-types';
import { fetchFromAlchemy, Method } from '../../provider/alchemy/http';

export enum EthereumProvider {
  ALCHEMY,
}

export class EthereumFactory implements Factory {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }
  getProviderFunctions = (provider: EthereumProvider): ProviderFunctions => {
    switch (provider) {
      default:
        return this.alchemy;
    }
  };

  private alchemy: ProviderFunctions = {
    fetcher: {
      fetchBalance: (address: string) =>
        fetchFromAlchemy<AlchemyBalance>(alchemyEndpoints(this.network), Method.Balance, [address, 'latest']),
      fetchTransactions: (address: string) =>
        fetchFromAlchemy<AlchemyTransaction>(alchemyEndpoints(this.network), Method.Transactions, [
          {
            fromBlock: '0x0',
            toAddress: address,
            toBlock: 'latest',
            category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
          },
        ]),
      sendRawTransaction: (transaction: string) =>
        fetchFromAlchemy<AlchemyBroadCastTransactionResult>(alchemyEndpoints(this.network), Method.SendTransaction, [
          transaction,
        ]),
      fetchFees: () => fetchFromAlchemy<AlchemyFees>(alchemyEndpoints(this.network), Method.GasPrice),
      fetchTransactionCount: (address: string) =>
        fetchFromAlchemy<AlchemyTransactionCount>(alchemyEndpoints(this.network), Method.TransactionCount, [
          address,
          'latest',
        ]),
    },
    mapper: {
      responseToBalance: mapAlchemyBalance,
      responseToTransactions: mapAlchemyTransactions,
      responseToBroadCastTransactionResult: mapAlchemyResultToString,
      responseToFees: mapAlchemyResultToString,
      responseToTransactionCount: mapAlchemyResultToString,
    },
  };
}
