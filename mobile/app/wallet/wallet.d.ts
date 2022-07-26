import { MPCWallet } from "../api-types/wallet";

export interface CryptoWallet {
  transactions: Transaction[];
  balance?: Balance;
  mpcWallet: MPCWallet;
  internal: ChangeWallet;
  external: ChangeWallet;
}

interface ChangeWallet {
  share: string;
  addresses: AddressWallet[];
}

interface AddressWallet {
  share: string;
  publicKey: string;
  address: string;
}

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
  weight: number;
  witnessHash: string;
}

export interface Input {
  prevout: Prevout;
  sequence: number;
  script: string;
  coin: Coin;
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

export interface CoinTypeWallet {
  mpcWallet: MPCWallet;
  config: WalletConfig;
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
