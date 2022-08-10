export interface Endpoints {
  balance: (address: string) => string;
  transactions: (address: string, query: URLSearchParams) => string;
  utxo: (transactionHash: string, index: number) => string;
  fees: () => string;
  broadcastTransaction: () => string;
}
