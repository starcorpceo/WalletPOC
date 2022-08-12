import { User } from "api-types/user";
import { CoinTypeAccount } from "wallet/types/wallet";

type NavigationRoutes = {
  Home: undefined;
  Bitcoin: { isStateEmpty: boolean; user: User };
  Ethereum: { isStateEmpty: boolean; user: User };
  BitcoinTransactions: { account: CoinTypeAccount };
  SendTransaction: { account: CoinTypeAccount };
};
