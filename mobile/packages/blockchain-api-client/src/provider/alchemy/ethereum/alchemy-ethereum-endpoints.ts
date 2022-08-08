import { Endpoints } from '../../../base/endpoints';
import { Network } from '../../../base/types';

const mainUrl = 'https://eth-mainnet.alchemyapi.io/v2/';
const testUrl = 'https://eth-goerli.alchemyapi.io/v2/';

export const alchemyEndpoints = (network: Network): Endpoints => {
  const url = getNetworkUrl(network);

  return {
    balance: function(): string {
      return url;
    },
    transactions: function(): string {
      return url;
    },
    utxo: function(): string {
      return url;
    },
    fees: function(): string {
      return url;
    },
    broadcastTransaction: function(): string {
      return url;
    },
  };
};

const getNetworkUrl = (network: Network) => {
  if (network === 'MAIN') return mainUrl;

  if (network === 'TEST') return testUrl;

  return mainUrl;
};
