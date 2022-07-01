/**
 * A transaction based on tatum bitcoin transaction
 *
 * @property {string} hash Hash of the transaction
 * @property {string} hex Hex of the transaction - referred to as txId
 * @property {string} block Block in which the transaction is mined
 * @property {number} blockNumber Block number of the block with the transaction
 * @property {number} time Transaction time
 * @property {number} mtime Time the transaction was mined
 * @property {string} witnessHash Hash of witness - only segWit transactions
 * @property {number} fee Fees payed for the transaction
 * @property {number} locktime Locktime sets the earliest time a transaction can be mined in to a block.
 * @property {TransactionInput} inputs Array with all the inputs
 * @property {TransactionOutput} output Array with all the outputs
 *
 */

export interface ITransaction {
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

export interface Input {
  prevout: Prevout;
  sequence: number;
  script: string;
  coin: Coin;
}

export interface Coin {
  version: number;
  height: number;
  value: number;
  script: string;
  address: string;
  coinbase: boolean;
}

export interface Prevout {
  hash: string;
  index: number;
}

export interface Output {
  value: number;
  script: string;
  address: string;
}
