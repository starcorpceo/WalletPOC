const endpoints = {
  bitcoin: {
    balance: (address: string) =>
      "https://api-eu1.tatum.io/v3/bitcoin/address/balance/" + address,
    transaction: (address: string, query: URLSearchParams) =>
      `https://api-eu1.tatum.io/v3/bitcoin/transaction/address/${address}?${query.toString()}`,
    utxo: (transactionHash: string, index: number) =>
      "https://api-eu1.tatum.io/v3/bitcoin/utxo/" +
      transactionHash +
      "/" +
      index,
    fees: () => "https://api-eu1.tatum.io/v3/blockchain/estimate",
    broadcastTransaction: () => "https://api-eu1.tatum.io/v3/bitcoin/broadcast",
  },

  virtualAccounts: {
    //POST
    createAccount: () => "https://api-eu1.tatum.io/v3/ledger/account",
  },
};

export const apiKeys = {
  tatum: "89156412-0b04-4ed1-aede-d4546b60697c",
};

export default endpoints;
