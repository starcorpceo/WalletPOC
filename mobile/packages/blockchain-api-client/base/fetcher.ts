import { ApiBalance, ApiTransaction } from "..";

export interface Fetcher {
  fetchBalance: (address: string) => Promise<ApiBalance>;
  fetchTransactions: (address: string, query: URLSearchParams) => Promise<ApiTransaction>;
}
