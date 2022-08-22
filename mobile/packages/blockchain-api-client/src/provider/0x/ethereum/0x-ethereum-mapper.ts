import { ApiSwapQuote } from '../../../base/types';
import { Api0xSwapQuote } from './0x-ethereum-types';

export const map0xSwapQuote = (swapQuote: ApiSwapQuote<Api0xSwapQuote>): Api0xSwapQuote => swapQuote;
