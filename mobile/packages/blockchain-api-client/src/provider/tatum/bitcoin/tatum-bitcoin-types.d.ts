export interface TatumBalance {
  incoming: number;
  outgoing: number;
}

export interface TatumTransaction {
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
  weight: number;
  witnessHash: string;
}

export interface TatumFees {
  fast: number;
  medium: number;
  slow: number;
}
