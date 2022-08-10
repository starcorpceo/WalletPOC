import {
  ApiBalance,
  ApiBroadcastTransaction,
  ApiFees,
  ApiTransaction,
  Balance,
  BroadcastTransaction,
  Fees,
  Transaction,
} from './types';

export interface Mapper {
  responseToBalance: (input: ApiBalance) => Balance;
  responseToTransactions: (input: ApiTransaction) => Transaction[];
  responseToFees: (input: ApiFees) => Fees;
  responseToBroadcastTransaction: (input: ApiBroadcastTransaction) => BroadcastTransaction;
}
