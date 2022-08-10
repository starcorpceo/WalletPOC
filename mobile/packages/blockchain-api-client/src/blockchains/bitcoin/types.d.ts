export interface BitcoinBalance {
  incoming: number;
  outgoing?: number;
  unconfirmedBalance?: number;
  confirmedBalance?: number;
}

export interface BitcoinTransaction {
  blockNumber: number;
  fee: number;
  hash: string;
  hex: string;
  index: number;
  inputs: Input[];
  locktime: number;
  outputs: Output[];
  size: number;
  time: number;
  version: number;
  vsize: number;
  witnessHash: string;
  total: number | undefined;
}

export interface BitcoinProvider {
  fetcher: BitcoinFetcher;
  mapper: BitcoinMapper;
}

export interface BitcoinEndpoints {
  balance: (...args: any) => string;
  transactions: (...args: any) => string;
  utxo: (...args: any) => string;
  fees: (...args: any) => string;
  broadcastTransaction: (...args: any) => string;
}
