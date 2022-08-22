import { config } from "ethereum/config/ethereum-config";
import { WalletConfig } from "wallet/types/wallet";

export const defaultEthereumAccountConfig: WalletConfig = {
  symbol: "ETH",
  name: "Ethereum",
  chain: "Ethereum",
  isTestnet: config.IsTestNet,
};

export const swapFeeAddress = "0x4321Dcb5E1227C93D8E5a022B1715A8b204bB6C6";
export const swapFeePercentage = "0.005";
