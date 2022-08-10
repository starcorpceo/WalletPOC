import { ApiBalance, ApiFees, ApiTransaction, Balance, Fees, Transaction } from './types';

export interface Mapper {
  responseToBalance: (input: ApiBalance) => Balance;
  responseToTransactions: (input: ApiTransaction) => Transaction[];
  responseToFees: (input: ApiFees) => Fees;
}
