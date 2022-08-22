import { Network } from '../../base/types';
import { alchemyEthereumFetcher } from '../../provider/alchemy/ethereum/alchemy-ethereum-fetcher';
import {
  mapAlchemyBalance,
  mapAlchemyResult,
  mapAlchemyResultToString,
  mapAlchemyTransactions,
} from '../../provider/alchemy/ethereum/alchemy-ethereum-mapper';
import {
  AlchemyBalance,
  AlchemyBroadCastTransaction,
  AlchemyFees,
  AlchemyTokenBalances,
  AlchemyTransaction,
  AlchemyTransactionCount,
} from '../../provider/alchemy/ethereum/alchemy-ethereum-types';
import { EthereumProvider } from './types';

export enum EthereumProviderEnum {
  ALCHEMY,
}

export class EthereumFactory {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  getProviderFunctions = (provider: EthereumProviderEnum) => {
    switch (provider) {
      default:
        return this.alchemy(this.network);
    }
  };

  private alchemy = (network: Network): EthereumProvider => ({
    fetcher: alchemyEthereumFetcher(network),
    mapper: {
      responseToBalance: input => mapAlchemyBalance(input as AlchemyBalance),
      responseToTransactions: input => mapAlchemyTransactions(input as AlchemyTransaction[]),
      responseToBroadcastTransaction: input => mapAlchemyResultToString(input as AlchemyBroadCastTransaction),
      responseToFees: input => mapAlchemyResultToString(input as AlchemyFees),
      responseToTransactionCount: input => mapAlchemyResultToString(input as AlchemyTransactionCount),
      responseToTokenBalances: input => mapAlchemyResult(input as AlchemyTokenBalances),
    },
  });
}
