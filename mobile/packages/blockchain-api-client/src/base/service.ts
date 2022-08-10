import { Balance, Fees, Provider, Transaction } from './types';

export interface Service {
  getBalance: (address: string, provider: Provider) => Promise<Balance>;
  getTransactions: (address: string, query: URLSearchParams, provider: Provider) => Promise<Transaction[]>;
  getFees: (chain: string, type: string, fromUTXO: any[], to: any[], provider: Provider) => Promise<Fees>;
}
