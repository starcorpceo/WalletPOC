import { ApiBalance, ApiTransaction } from "./types";

export interface Fetcher {
  fetchBalance: (address: string) => Promise<ApiBalance>;
  fetchTransactions: (address: string, query: URLSearchParams) => Promise<ApiTransaction>;
}
