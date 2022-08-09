import { CoinTypeAccount, Transaction } from "wallet/types/wallet";

export const getAllTransactions = (account: CoinTypeAccount): Transaction[] => {
  let transactions: Transaction[] = [];
  account.external.addresses.map((address) => {
    transactions.push(...address.transactions);
  });
  return transactions;
};
