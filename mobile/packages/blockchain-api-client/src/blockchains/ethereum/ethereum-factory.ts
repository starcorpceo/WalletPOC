import { Network } from '../../base/types';
import { api0xEthereumFetcher } from '../../provider/0x/ethereum/0x-ethereum-fetcher';
import { map0xSwapQuote } from '../../provider/0x/ethereum/0x-ethereum-mapper';
import { Api0xSwapQuote } from '../../provider/0x/ethereum/0x-ethereum-types';
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
  API0X,
}

export class EthereumFactory {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  getProviderFunctions = (provider: EthereumProviderEnum) => {
    switch (provider) {
      case EthereumProviderEnum.API0X:
        return this.api0x(this.network);
      default:
        return this.alchemy(this.network);
    }
  };

  private api0x = (network: Network): EthereumProvider => ({
    fetcher: api0xEthereumFetcher(network),
    mapper: {
      responseToSwapQuote: input => map0xSwapQuote(input as Api0xSwapQuote),
    },
  });

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
