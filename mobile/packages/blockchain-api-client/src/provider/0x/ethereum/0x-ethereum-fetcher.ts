import { Network } from '../../../base/types';
import { fetchFrom0x } from '../http';
import { api0xEndpoints } from './0x-ethereum-endpoints';
import { Api0xSwapQuote } from './0x-ethereum-types';

export const api0xEthereumFetcher = (network: Network) => ({
  fetchSwapQuote: (params: string) => fetchFrom0x<Api0xSwapQuote>(api0xEndpoints(network).swapQuote(params)),
});
