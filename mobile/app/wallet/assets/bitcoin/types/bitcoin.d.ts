import { BitcoinBalance } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import { CoinTypeAccount } from "wallet/types/wallet";

export interface BitcoinWallet extends CoinTypeAccount {
  balance: BitcoinBalance;
}
