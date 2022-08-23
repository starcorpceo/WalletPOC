import {
  ApiBalance,
  ApiBroadcastTransaction,
  ApiFees,
  ApiSwapQuote,
  ApiTokenBalances,
  ApiTransaction,
  ApiTransactionCount,
} from '../../base/types';
import { ZeroExSwapQuote } from '../../provider/0x/ethereum/0x-ethereum-types';
import { EthereumBalance, EthereumTokenBalances, EthereumTransaction } from './types';

export interface EthereumMapper {
  responseToBalance: (input: ApiBalance) => EthereumBalance;
  responseToTransactions: (input: ApiTransaction) => EthereumTransaction[];
  responseToBroadcastTransaction: (input: ApiBroadcastTransaction) => string;
  responseToTransactionCount: (input: ApiTransactionCount) => string;
  responseToFees: (input: ApiFees) => string;
  responseToTokenBalances: (input: ApiTokenBalances) => EthereumTokenBalances;
  responseToSwapQuote: (input: ApiSwapQuote) => ZeroExSwapQuote;
}
