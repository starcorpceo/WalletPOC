import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";

/**
 * Broadcasts a signed bitcoin transaction via TATUM
 * @param transaction Signed transaction
 * @returns
 */
export const broadcastTransaction = async (transaction: string): Promise<string> => {
  const service = new EthereumService("TEST");
  const broadcastTransaction: string = await service.sendRawTransaction(transaction, EthereumProviderEnum.ALCHEMY);
  if (!broadcastTransaction) throw new Error("Failed to broadcast transaction");
  return broadcastTransaction;
};
