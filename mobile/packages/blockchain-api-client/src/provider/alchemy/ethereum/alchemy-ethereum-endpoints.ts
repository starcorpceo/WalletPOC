import { Network } from '../../../base/types';

const mainUrl = 'https://eth-mainnet.alchemyapi.io/v2/';
const testUrl = 'https://eth-goerli.alchemyapi.io/v2/';

export const alchemyEndpoints = (network: Network): string => {
  return getNetworkUrl(network);
};

const getNetworkUrl = (network: Network) => {
  if (network === 'MAIN') return mainUrl;

  if (network === 'TEST') return testUrl;

  return mainUrl;
};
