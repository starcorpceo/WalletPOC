import { CoinTypeAccount } from "wallet/types/wallet";
import { VirtualAccount } from "wallet/virtual-wallet";

type NavigationRoutes = {
  Home: undefined;
  Bitcoin: undefined;
  Ethereum: undefined;
  BitcoinTransactions: { account: CoinTypeAccount };
  SendTransaction: { account: CoinTypeAccount };
};
