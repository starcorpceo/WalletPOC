import { User } from "api-types/user";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { BitcoinTransaction } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import { CoinTypeAccount } from "wallet/types/wallet";

type NavigationRoutes = {
  Home: undefined;
  BitcoinScreen: { isStateEmpty: boolean; user: User };
  Ethereum: { isStateEmpty: boolean; user: User };
  BitcoinSendScreen: { account: BitcoinWallet };
  BitcoinReceiveScreen: { account: CoinTypeAccount };
  BitcoinSingleTransactionScreen: { transaction: BitcoinTransaction; wallet: BitcoinWallet };
};
