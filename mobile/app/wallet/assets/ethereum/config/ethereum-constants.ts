import { config } from "ethereum/config/ethereum-config";
import { WalletConfig } from "wallet/types/wallet";

export const defaultEthereumAccountConfig: WalletConfig = {
  symbol: "ETH",
  name: "Ethereum",
  chain: "Ethereum",
  isTestnet: config.IsTestNet,
};
