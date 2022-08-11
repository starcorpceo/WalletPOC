import { config } from "ethereum/config/ethereum-config";
import { Transaction, TxData } from "ethereumjs-tx";

export const buildRawTransaction = async (
  to: string,
  value: number,
  txCount: string,
  gasPrice: string
): Promise<Transaction> => {
  const txData: TxData = {
    nonce: txCount,
    to,
    value,
    gasPrice,
    v: Buffer.from([]),
    r: Buffer.from([]),
    s: Buffer.from([]),
  };

  const tx = new Transaction(txData, { chain: config.chain });

  tx.gasLimit = tx.getBaseFee().toBuffer();

  return tx;
};
