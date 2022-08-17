import { Network } from '../../../base/types';
import { fetchFromAlchemy, Method } from '../http';
import { alchemyEndpoints } from './alchemy-ethereum-endpoints';
import {
  AlchemyBalance,
  AlchemyBroadCastTransaction,
  AlchemyFees,
  AlchemyTokenBalances,
  AlchemyTransaction,
  AlchemyTransactionCount,
} from './alchemy-ethereum-types';

export const alchemyEthereumFetcher = (network: Network) => ({
  fetchBalance: (address: string) =>
    fetchFromAlchemy<AlchemyBalance>(alchemyEndpoints(network), Method.Balance, [address, 'latest']),
  fetchTransactions: async (address: string) =>
    await Promise.all([
      fetchAlchemyTransactions('from', network, address, ['external']),
      fetchAlchemyTransactions('to', network, address, ['external']),
    ]),
  fetchERC20Transactions: async (address: string) =>
    await Promise.all([
      fetchAlchemyTransactions('from', network, address, ['erc20']),
      fetchAlchemyTransactions('to', network, address, ['erc20']),
    ]),
  sendRawTransaction: (transaction: string) =>
    fetchFromAlchemy<AlchemyBroadCastTransaction>(alchemyEndpoints(network), Method.SendTransaction, [transaction]),
  fetchFees: () => fetchFromAlchemy<AlchemyFees>(alchemyEndpoints(network), Method.GasPrice),
  fetchTransactionCount: (address: string) =>
    fetchFromAlchemy<AlchemyTransactionCount>(alchemyEndpoints(network), Method.TransactionCount, [address, 'latest']),
  fetchTokenBalances: (address: string, contractAddresses: string[]) =>
    fetchFromAlchemy<AlchemyTokenBalances>(alchemyEndpoints(network), Method.TokenBalances, [
      address,
      contractAddresses,
    ]),
  fetchEstimatedGas: (from: string, to: string, data: string) =>
    fetchFromAlchemy<AlchemyFees>(alchemyEndpoints(network), Method.EstimateGas, [{ from, to, data }]),
});

const fetchAlchemyTransactions = (mode: 'from' | 'to', network: Network, address: string, category: string[]) =>
  fetchFromAlchemy<AlchemyTransaction>(alchemyEndpoints(network), Method.Transactions, [
    getTransactionQuery(address, mode, category),
  ]);

const getTransactionQuery = (address: string, mode: 'from' | 'to', category: string[]) => ({
  fromBlock: '0x0',
  fromAddress: mode === 'from' ? address : undefined,
  toAddress: mode === 'to' ? address : undefined,
  toBlock: 'latest',
  category: category,
});
