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
  },
};

export const apiKeys = {
  tatum: "89156412-0b04-4ed1-aede-d4546b60697c",
};

export default endpoints;
