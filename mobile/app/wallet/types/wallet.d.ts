import { BitcoinBalance } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
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
}

export type Balance = BitcoinBalance | number;

export interface AccountChange {
  keyShare: ChangeKeyShare;
  addresses: Address[];
}

export interface Address {
  keyShare: AddressKeyShare;
  address: string;
  publicKey: string;
  transactions: Transaction[];
  balance: Balance;
}

export type Transaction = BitcoinTransaction | EthereumTransaction;

export interface WalletConfig {
  symbol: string;
  name: null | string;
  chain: string;
  isTestnet: boolean;
}

export interface Fees {
  fast: number;
  medium: number;
  slow: number;
}
