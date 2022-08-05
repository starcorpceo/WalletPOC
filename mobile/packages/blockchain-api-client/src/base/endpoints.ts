import { Provider } from "./types";

export interface Endpoints {
  balance: (address: string) => string;
  transactions: (address: string, query: URLSearchParams) => string;
  utxo: (transactionHash: string, index: number) => string;
  fees: (provider: Provider) => string;
  broadcastTransaction: (provider: Provider) => string;
}
