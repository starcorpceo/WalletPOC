import { ApiBalance, ApiTransaction, Balance, Transaction } from './types';

export interface Mapper {
  responseToBalance: (input: ApiBalance) => Balance;
  responseToTransactions: (input: ApiTransaction) => Transaction[];
}
