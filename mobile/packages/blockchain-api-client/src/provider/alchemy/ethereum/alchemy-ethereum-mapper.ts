import { EthereumBalance, EthereumTransaction } from '../../../blockchains/ethereum/types';
import { AlchemyBalance, AlchemyTransaction } from './alchemy-ethereum-types';

export const mapAlchemyBalance = (balance: AlchemyBalance): EthereumBalance => {
  return {
    value: Number.parseInt(balance.result, 16),
  };
};

export const mapAlchemyTransactions = (transaction: AlchemyTransaction): EthereumTransaction[] => {
  return transaction.result.transfers;
};
