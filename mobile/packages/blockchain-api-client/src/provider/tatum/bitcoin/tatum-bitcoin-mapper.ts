import { Balance, Fees, Transaction } from '../../../base/types';
import { TatumBalance, TatumFees, TatumTransaction } from './tatum-bitcoin-types';

export const mapTatumBalance = (input: TatumBalance): Balance => input;
export const mapTatumTransactions = (transactions: TatumTransaction[]): Transaction[] =>
  transactions.map((transaction) => ({ ...transaction, total: undefined }));
export const mapTatumFees = (fees: TatumFees): Fees => fees;
