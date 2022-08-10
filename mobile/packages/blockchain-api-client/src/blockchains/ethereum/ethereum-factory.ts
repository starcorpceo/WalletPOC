import { Network } from '../../base/types';
import { alchemyEthereumFetcher } from '../../provider/alchemy/ethereum/alchemy-ethereum-fetcher';
import {
  mapAlchemyBalance,
  mapAlchemyResultToString,
  mapAlchemyTransactions,
} from '../../provider/alchemy/ethereum/alchemy-ethereum-mapper';
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
      responseToBalance: mapAlchemyBalance,
      responseToTransactions: mapAlchemyTransactions,
      responseToBroadCastTransactionResult: mapAlchemyResultToString,
      responseToFees: mapAlchemyResultToString,
      responseToTransactionCount: mapAlchemyResultToString,
    },
  });
}
