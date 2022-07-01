import type { IWallet, IWalletConfig } from './';
import { getBalance, Balance, IBalance } from '../balance';
import type { ITransaction } from '../transaction';
import { getLatestTransactions } from '../transaction';

export class Wallet implements IWallet {
  config: IWalletConfig;
  balance: IBalance;
  transactions: ITransaction[];

  constructor(config: IWalletConfig) {
    this.config = config;
    this.balance = new Balance(config.symbol, 0);
    this.transactions = [];
  }

  refreshBalance = async (): Promise<IWallet> => {
    this.balance = await getBalance(this);
    return { ...this };
  };

  refreshTransactions = async (): Promise<IWallet> => {
    this.transactions = await getLatestTransactions(this, 10, 0);
    return { ...this };
  };
}
