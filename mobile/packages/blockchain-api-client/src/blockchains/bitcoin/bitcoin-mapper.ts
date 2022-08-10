import { ApiBalance, ApiBroadCastTransactionResult, ApiFees, ApiTransaction } from '../../base/types';
import { BitcoinBalance, BitcoinTransaction } from './types';

export interface BitcoinMapper {
  responseToBalance: (input: ApiBalance) => BitcoinBalance;
  responseToTransactions: (input: ApiTransaction) => BitcoinTransaction[];
  responseToBroadCastTransactionResult: (input: ApiBroadCastTransactionResult) => any;
  responseToFees: (input: ApiFees) => any;
}
