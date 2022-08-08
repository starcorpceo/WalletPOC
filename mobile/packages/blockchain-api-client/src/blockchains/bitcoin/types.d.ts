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
