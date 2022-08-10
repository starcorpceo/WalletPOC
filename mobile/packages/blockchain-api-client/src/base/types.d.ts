import { BitcoinProvider } from './blockchains/bitcoin/bitcoin-factory';
import {
  BlockCypherBalance,
  BlockCypherBalanceFull,
  BlockCyperFees,
} from './provider/blockcypher/bitcoin/blockcypher-bitcoin-types';
import { TatumBalance, TatumTransaction, TatumFees } from './provider/tatum/bitcoin/tatum-bitcoin-types';

export type Provider = BitcoinProvider;

export type ApiBalance<T = BlockCypherBalance | TatumBalance> = T;
export type ApiTransaction<T = BlockCypherBalanceFull | TatumTransaction[]> = T;
export type ApiFees<T = BlockCyperFees | TatumFees> = T;

export interface TransactionRequest {}

export type Network = 'TEST' | 'MAIN';

export interface Balance {
  incoming: number;
  outgoing: number;

  // Is not delivered by tatum but would be cool to have
  unconfirmedBalance?: number;
  confirmedBalance?: number;
}

export interface Transaction {
  blockNumber: number;
  fee: number;
  hash: string;
  hex: string;
  index: number;
  inputs: Input[];
  locktime: number;
  outputs: Output[];
  size: number;
  time: number;
  version: number;
  vsize: number;
  witnessHash: string;
  total: number | undefined;
}

export interface Input {
  prevout: Prevout;
  sequence: number;
  script: string;
  scriptType: string;
}

export interface Coin {
  version: number;
  height: number;
  value: number;
  script: string;
  address: string;
  coinbase: boolean;
}

export interface Prevout {
  hash: string;
  index: number;
}

export interface Output {
  value: number;
  script: string;
  address: string;
}

export interface WalletConfig {
  symbol: string;
  name: null | string;
  chain: string;
  isTestnet: boolean;
}

export interface UTXO {
  version: number;
  height: number;
  value: number;
  script: string;
  address: string;
  coinbase: boolean;
  hash: string;
  index: number;
}

export interface Fees {
  fast: number;
  medium: number;
  slow: number;
}
