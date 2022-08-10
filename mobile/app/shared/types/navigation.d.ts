import { VirtualAccount } from "wallet/virtual-wallet";

type NavigationRoutes = {
  Home: undefined;
  Bitcoin: undefined;
  Ethereum: undefined;
  BitcoinTransactions: { account: VirtualAccount | null };
  SendTransaction: { account: VirtualAccount | null };
};
