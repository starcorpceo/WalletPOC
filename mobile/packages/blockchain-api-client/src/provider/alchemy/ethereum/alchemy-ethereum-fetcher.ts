import { Network } from '../../../base/types';
import { fetchFromAlchemy, Method } from '../http';
import { alchemyEndpoints } from './alchemy-ethereum-endpoints';
import {
  AlchemyBalance,
  AlchemyBroadCastTransactionResult,
  AlchemyFees,
  AlchemyTransaction,
  AlchemyTransactionCount,
} from './alchemy-ethereum-types';

export const alchemyEthereumFetcher = (network: Network) => ({
  fetchBalance: (address: string) =>
    fetchFromAlchemy<AlchemyBalance>(alchemyEndpoints(network), Method.Balance, [address, 'latest']),
  fetchTransactions: async (address: string) =>
    await Promise.all([
      fetchAlchemyTransactions('from', network, address),
      fetchAlchemyTransactions('to', network, address),
    ]),
  sendRawTransaction: (transaction: string) =>
    fetchFromAlchemy<AlchemyBroadCastTransactionResult>(alchemyEndpoints(network), Method.SendTransaction, [
      transaction,
    ]),
  fetchFees: () => fetchFromAlchemy<AlchemyFees>(alchemyEndpoints(network), Method.GasPrice),
  fetchTransactionCount: (address: string) =>
    fetchFromAlchemy<AlchemyTransactionCount>(alchemyEndpoints(network), Method.TransactionCount, [address, 'latest']),
});

const fetchAlchemyTransactions = (mode: 'from' | 'to', network: Network, address: string) =>
  fetchFromAlchemy<AlchemyTransaction>(alchemyEndpoints(network), Method.Transactions, [
    getTransactionQuery(address, mode),
  ]);

const getTransactionQuery = (address: string, mode: 'from' | 'to') => ({
  fromBlock: '0x0',
  fromAddress: mode === 'from' ? address : undefined,
  toAddress: mode === 'to' ? address : undefined,
  toBlock: 'latest',
  category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
});
