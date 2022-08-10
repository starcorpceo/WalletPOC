export type AlchemyResult<T> = {
  jsonrpc: string;
  id: number;
  result: T;
};

export type AlchemyBalance = AlchemyResult<string>;
export type AlchemyTransaction = AlchemyResult<Result>;
export type AlchemyFees = AlchemyResult<string>;
export type AlchemyBroadCastTransactionResult = AlchemyResult<string>;
export type AlchemyTransactionCount = AlchemyResult<string>;

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
