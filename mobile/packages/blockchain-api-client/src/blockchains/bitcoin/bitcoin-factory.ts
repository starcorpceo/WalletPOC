import { Factory, ProviderFunctions } from "../../base/factory";
import { ApiBalance, ApiTransaction, Network } from "../../base/types";
import { blockCypherEndpoints } from "../../provider/blockcypher/bitcoin/blockcypher-bitcoin-endpoints";
import {
  mapBlockCypherBalance,
  mapBlockCypherTransactions,
} from "../../provider/blockcypher/bitcoin/blockcypher-bitcoin-mapper";
import {
  BlockCypherBalance,
  BlockCypherBalanceFull,
} from "../../provider/blockcypher/bitcoin/blockcypher-bitcoin-types";
import { fetchFromBlockCypher } from "../../provider/blockcypher/http";
import { tatumEndpoints } from "../../provider/tatum/bitcoin/tatum-bitcoin-endpoints";
import { mapTatumBalance, mapTatumTransactions } from "../../provider/tatum/bitcoin/tatum-bitcoin-mapper";
import { TatumBalance, TatumTransaction } from "../../provider/tatum/bitcoin/tatum-bitcoin-types";
import { fetchFromTatum } from "../../provider/tatum/http";

export enum BitcoinProvider {
  TATUM,
  BLOCKCYPHER,
}

export class BitcoinFactory implements Factory {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }
  getProviderFunctions = (provider: BitcoinProvider): ProviderFunctions => {
    switch (provider) {
      case BitcoinProvider.TATUM:
        return this.tatum;

      case BitcoinProvider.BLOCKCYPHER:
        return this.blockCypher;

      default:
        return this.tatum;
    }
  };

  private blockCypher: ProviderFunctions = {
    fetcher: {
      fetchBalance: (address: string) =>
        fetchFromBlockCypher<BlockCypherBalance>(blockCypherEndpoints(this.network).balance(address)),
      fetchTransactions: (address: string, query: URLSearchParams) =>
        fetchFromBlockCypher<BlockCypherBalanceFull>(blockCypherEndpoints(this.network).transactions(address, query)),
    },
    mapper: {
      responseToBalance: (input: ApiBalance) => mapBlockCypherBalance(input as BlockCypherBalance),
      responseToTransactions: (input: ApiTransaction) => mapBlockCypherTransactions(input as BlockCypherBalanceFull),
    },
  };

  private tatum: ProviderFunctions = {
    fetcher: {
      fetchBalance: (address: string) => fetchFromTatum<TatumBalance>(tatumEndpoints.balance(address), this.network),
      fetchTransactions: (address: string, query: URLSearchParams) =>
        fetchFromTatum<TatumTransaction[]>(tatumEndpoints.transactions(address, query), this.network),
    },
    mapper: {
      responseToTransactions: (input: ApiTransaction) => mapTatumTransactions(input as TatumTransaction[]),
      responseToBalance: (input: ApiBalance) => mapTatumBalance(input as TatumBalance),
    },
  };
}
