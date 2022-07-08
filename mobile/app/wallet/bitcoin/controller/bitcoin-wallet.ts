import { fetchFromTatum } from "lib/http";
import endpoints from "wallet/endpoints";
import { Balance, IWallet, Transaction, WalletConfig } from "wallet/wallet";

export class BitcoinWallets implements IWallet {
  config: WalletConfig;
  transactions: Transaction[] = [];
  balance?: Balance;

  constructor(config: WalletConfig) {
    this.config = config;
  }

  refreshBalance = async (): Promise<BitcoinWallets> => {
    console.log("balaance", this.balance);

    this.balance = await getBalance(this);

    console.log("balaance", this.balance);
    return { ...this };
  };

  refreshTransactions = async (): Promise<BitcoinWallets> => {
    this.transactions = await getLatestTransactions(this, 10, 0);
    console.log("transactions", this.balance);

    return { ...this };
  };
}

export const getBalance = (wallet: IWallet): Promise<Balance> => {
  return fetchFromTatum<Balance>(
    endpoints.bitcoin.balance(wallet.config.address)
  );
};

export const getLatestTransactions = (
  wallet: IWallet,
  pageSize: number = 10,
  offset: number = 0
): Promise<Transaction[]> => {
  const query = new URLSearchParams({
    pageSize: pageSize.toString(),
    offset: offset.toString(),
  });

  return fetchFromTatum<Transaction[]>(
    endpoints.bitcoin.transaction(wallet.config.address, query)
  );
};
