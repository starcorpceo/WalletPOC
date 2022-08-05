import { Balance, Transaction } from '../../../base/types';
import { TatumBalance, TatumTransaction } from './tatum-bitcoin-types';

export const mapTatumBalance = (input: TatumBalance): Balance => input;
export const mapTatumTransactions = (transactions: TatumTransaction[]): Transaction[] =>
  transactions.map(transaction => ({ ...transaction, total: undefined }));
