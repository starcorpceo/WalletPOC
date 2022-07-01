/**
 * Wallet - represents a pub/priv keypair - presumably derived
 * CAVE - no private key included
 *
 * @property {IWalletConfig} config Config of wallet, includes important infos
 * @property {IBalance} balance Balance object with balance infos of wallet
 */

import type { IBalance } from '../balance/IBalance';
import type { ITransaction } from '../transaction';
import type { IWalletConfig } from './IWalletConfig';

export interface IWallet {
  config: IWalletConfig;
  balance: IBalance;
  transactions: ITransaction[];
  refreshBalance(): Promise<IWallet>;
  refreshTransactions(): Promise<IWallet>;
}
