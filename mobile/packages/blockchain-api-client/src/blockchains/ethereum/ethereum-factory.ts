import { Network } from '../../base/types';
import { zeroExEthereumFetcher } from '../../provider/0x/ethereum/0x-ethereum-fetcher';
import { mapZeroExSwapQuote } from '../../provider/0x/ethereum/0x-ethereum-mapper';
import { ZeroExSwapQuote } from '../../provider/0x/ethereum/0x-ethereum-types';
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
  ZEROEX,
}

export class EthereumFactory {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  getProviderFunctions = (provider: EthereumProviderEnum) => {
    switch (provider) {
      case EthereumProviderEnum.ZEROEX:
        return this.zeroEx(this.network);
      default:
        return this.alchemy(this.network);
    }
  };

  private zeroEx = (network: Network): EthereumProvider => ({
    fetcher: zeroExEthereumFetcher(network),
    mapper: {
      responseToSwapQuote: input => mapZeroExSwapQuote(input as ZeroExSwapQuote),
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
