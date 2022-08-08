export interface AlchemyBalance {
  jsonrpc: string;
  id: number;
  result: string;
}

export interface AlchemyTransaction {
  jsonrpc: string;
  id: number;
  result: Result;
}

interface Result {
  transfers: Transfer[];
}

interface Transfer {
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: null;
  erc1155Metadata: null;
  tokenId: null;
  asset: string;
  category: string;
  rawContract: RawContract;
}

interface RawContract {
  value: string;
  address: null;
  decimal: string;
}
