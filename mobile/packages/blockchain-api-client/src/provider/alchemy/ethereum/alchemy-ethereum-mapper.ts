import { EthereumBalance, EthereumTransaction } from '../../../blockchains/ethereum/types';
import { AlchemyBalance, AlchemyResult, AlchemyTransaction } from './alchemy-ethereum-types';

export const mapAlchemyBalance = (balance: AlchemyBalance): EthereumBalance => {
  return {
    value: Number.parseInt(balance.result, 16),
  };
};

export const mapAlchemyTransactions = (transaction: AlchemyTransaction[]): EthereumTransaction[] => {
  const transactions = transaction
    .flatMap(apiResult => apiResult.result.transfers)
    .sort((a, b) => Number.parseInt(a.blockNum, 16) - Number.parseInt(b.blockNum, 16));

  return transactions.map(transaction => ({ ...transaction, value: ethToGwei(transaction.value) }));
};

export const mapAlchemyResultToString = (response: AlchemyResult<string>): string => {
  return response.result;
};

export const ethToGwei = (eth: number): number => eth * 1000000000;
