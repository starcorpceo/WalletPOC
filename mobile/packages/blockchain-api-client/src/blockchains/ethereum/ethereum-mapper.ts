import {
  ApiBalance,
  ApiBroadCastTransactionResult,
  ApiFees,
  ApiTransaction,
  ApiTransactionCount,
} from '../../base/types';
import { EthereumBalance, EthereumTransaction } from './types';

export interface EthereumMapper {
  responseToBalance: (input: ApiBalance) => EthereumBalance;
  responseToTransactions: (input: ApiTransaction) => EthereumTransaction[];
  responseToBroadCastTransactionResult: (input: ApiBroadCastTransactionResult) => string;
  responseToTransactionCount: (input: ApiTransactionCount) => string;
  responseToFees: (input: ApiFees) => string;
}
