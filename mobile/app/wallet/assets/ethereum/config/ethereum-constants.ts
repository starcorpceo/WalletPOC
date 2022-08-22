import { config } from "ethereum/config/ethereum-config";
import { WalletConfig } from "wallet/types/wallet";

export const defaultEthereumAccountConfig: WalletConfig = {
  symbol: "ETH",
  name: "Ethereum",
  chain: "Ethereum",
  isTestnet: config.IsTestNet,
};

export const swapFeeAddress = "0xc19f4120fCf3b4326B716A4F1c45e88b95e8867D";
export const swapFeePercentage = "0.005";
