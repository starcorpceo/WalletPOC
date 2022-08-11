import { EthereumFetcher } from './ethereum-fetcher';
import { EthereumMapper } from './ethereum-mapper';

export interface EthereumBalance {
  value: number;
}

export interface EthereumTransaction {
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: string | null;
  erc1155Metadata: string | null;
  tokenId: string | null;
  asset: string;
  category: string;
  rawContract: RawContract;
}

export interface RawContract {
  value: string;
  address: null;
  decimal: string;
}

export interface EthereumProvider {
  fetcher: EthereumFetcher;
  mapper: EthereumMapper;
}
