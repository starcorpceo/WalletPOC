import { ApiSwapQuote, Chain, Network } from '../../base/types';
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
  private chain: Chain;

  constructor(network: Network, chain: Chain) {
    this.network = network;
    this.chain = chain;
  }

  getProviderFunctions = (provider: EthereumProviderEnum) => {
    switch (provider) {
      case EthereumProviderEnum.ZEROEX:
        return this.zeroEx(this.network) as EthereumProvider;
      default:
        return this.alchemy(this.network, this.chain);
    }
  };

  private zeroEx = (network: Network) => ({
    fetcher: zeroExEthereumFetcher(network),
    mapper: {
      responseToSwapQuote: (input: ApiSwapQuote) => mapZeroExSwapQuote(input as ZeroExSwapQuote),
    },
  });

  private alchemy = (network: Network, chain: Chain): EthereumProvider => ({
    fetcher: alchemyEthereumFetcher(network, chain),
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
