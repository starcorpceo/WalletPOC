import { Balance, Input, Output, Transaction } from "wallet/types/wallet";
import { BlockCypherBalance, BlockCypherBalanceFull } from "./blockcypher-bitcoin-types";

export const mapBlockCypherBalance = (balance: BlockCypherBalance): Balance => {
  return {
    incoming: balance.total_received,
    outgoing: balance.total_sent,
    unconfirmedBalance: balance.unconfirmed_balance,
    confirmedBalance: balance.final_balance,
  };
};

export const mapBlockCypherTransactions = (transaction: BlockCypherBalanceFull): Transaction[] => {
  return transaction.txs.map<Transaction>((transaction, index) => ({
    blockNumber: transaction.block_index,
    fee: transaction.fees,
    hash: transaction.hash,
    hex: transaction.hex || "",
    index,
    inputs: transaction.inputs.map<Input>((input) => ({
      prevout: {
        hash: input.prev_hash,
        index: input.output_index,
      },
      sequence: input.sequence,
      script: input.script,
      scriptType: input.script_type,
    })),
    locktime: transaction.lock_time,
    outputs: transaction.outputs.map<Output>((output) => ({
      value: output.value,
      script: output.script,
      address: output.addresses[0],
    })),
    size: transaction.size,
    time: transaction.received.getTime(),
    version: transaction.ver,
    vsize: transaction.vsize,
    total: transaction.total,
    witnessHash: transaction.witness_hash || "",
  }));
};
