import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import { AccountKeyShare, AddressKeyShare, ChangeKeyShare } from "shared/types/mpc";
import { VirtualAccount } from "./virtual-wallet";

export interface CoinTypeAccount {
  virtualAccount: VirtualAccount | undefined;
  mpcKeyShare: AccountKeyShare;
  internal: AccountChange;
  external: AccountChange;
  config: WalletConfig;
  xPub: string;
  transactions: BitcoinTransaction[];
  balance: BitcoinBalance;
}

export interface AccountChange {
  keyShare: ChangeKeyShare;
  addresses: Address[];
}

export interface Address {
  keyShare: AddressKeyShare;
  address: string;
  publicKey: Buffer;
  transactions: BitcoinTransaction[];
  balance: Balance;
}

export interface BitcoinBalance {
  incoming: number;
  outgoing: number;

  // Is not delivered by tatum but would be cool to have
  unconfirmedBalance?: number;
  confirmedBalance?: number;
}

export type Transaction = BitcoinTransaction | EthereumTransaction;

export interface BitcoinTransaction {
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
