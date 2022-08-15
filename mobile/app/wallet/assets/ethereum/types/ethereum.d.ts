import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import { CoinTypeAccount } from "wallet/types/wallet";

export interface EthereumWallet extends CoinTypeAccount {
  mempool: EthereumTransaction[];
}
