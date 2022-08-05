import { AccountKeyShare, AddressKeyShare, ChangeKeyShare } from "shared/types/mpc";
import { VirtualAccount } from "./virtual-wallet";

export interface CoinTypeAccount {
  virtualAccount: VirtualAccount;
  mpcKeyShare: AccountKeyShare;
  internal: AccountChange;
  external: AccountChange;
  config: WalletConfig;
  xPub: string;
  transactions: Transaction[];
  balance: Balance;
}

export interface AccountChange {
  keyShare: ChangeKeyShare;
  addresses: Address[];
}

export interface Address {
  keyShare: AddressKeyShare;
  address: string;
  publicKey: string;
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
