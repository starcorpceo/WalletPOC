export interface Endpoints {
  balance: (...args: any) => string;
  transactions: (...args: any) => string;
  utxo: (...args: any) => string;
  fees: (...args: any) => string;
  broadcastTransaction: (...args: any) => string;
}
