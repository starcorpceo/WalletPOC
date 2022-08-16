import { ApiBalance, ApiBroadcastTransaction, ApiFees, ApiTransaction, ApiTransactionCount } from '../../base/types';

export interface EthereumFetcher {
  fetchBalance: (address: string) => Promise<ApiBalance>;
  fetchTransactions: (address: string) => Promise<ApiTransaction>;
  sendRawTransaction?: (transaction: string) => Promise<ApiBroadcastTransaction>;
  fetchFees: () => Promise<ApiFees>;
  fetchTransactionCount: (address: string) => Promise<ApiTransactionCount>;
}
