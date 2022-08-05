import { Balance, Transaction } from "wallet/types/wallet";
import { Provider } from "./types";

export interface Service {
  getBalance: (address: string, provider: Provider) => Promise<Balance>;
  getTransactions: (address: string, query: URLSearchParams, provider: Provider) => Promise<Transaction[]>;
}
