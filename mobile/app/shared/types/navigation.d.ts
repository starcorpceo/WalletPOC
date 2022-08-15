import { User } from "api-types/user";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { BitcoinTransaction } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";

type NavigationRoutes = {
  Home: undefined;
  //Ethereum Screens
  EthereumScreen: { isStateEmpty: boolean; user: User };
  EthereumSendScreen: { account: EthereumWallet };
  EthereumReceiveScreen: { account: EthereumWallet };
  EthereumSingleTransactionScreen: { transaction: EthereumTransaction; wallet: EthereumWallet };

  //Bitcoin Screens
  BitcoinScreen: { isStateEmpty: boolean; user: User };
  BitcoinSendScreen: { account: BitcoinWallet };
  BitcoinReceiveScreen: { account: BitcoinWallet };
  BitcoinSingleTransactionScreen: { transaction: BitcoinTransaction; wallet: BitcoinWallet };
};
