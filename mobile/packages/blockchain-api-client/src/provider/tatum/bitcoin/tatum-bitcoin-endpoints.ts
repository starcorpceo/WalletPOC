import { Endpoints } from "../../../base/endpoints";

// TODO Deal with different Blockchains e.g. what if /btc/ should be /eth/
export const tatumEndpoints: Endpoints = {
  balance: function (address: string): string {
    return "https://api-eu1.tatum.io/v3/bitcoin/address/balance/" + address;
  },
  transactions: function (address: string, query: URLSearchParams): string {
    return `https://api-eu1.tatum.io/v3/bitcoin/transaction/address/${address}?${query.toString()}`;
  },
  utxo: function (transactionHash: string, index: number): string {
    return "https://api-eu1.tatum.io/v3/bitcoin/utxo/" + transactionHash + "/" + index;
  },
  fees: function (): string {
    return "https://api-eu1.tatum.io/v3/blockchain/estimate";
  },
  broadcastTransaction: function (): string {
    return "https://api-eu1.tatum.io/v3/bitcoin/broadcast";
  },
};
