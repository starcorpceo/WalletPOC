import { ApiBalance, ApiBroadcastTransaction, ApiFees, ApiTransaction, ApiTransactionCount } from './types';

export interface Mapper {
  responseToBalance: (input: ApiBalance) => any;
  responseToTransactions: (input: ApiTransaction) => any;
  responseToFees: (input: ApiFees) => any;
  responseToBroadcastTransaction: (input: ApiBroadcastTransaction) => any;
  responseToTransactionCount: (input: ApiTransactionCount) => any;
}
