import { config } from "bitcoin/config/bitcoin-config";
import { WalletConfig } from "wallet/types/wallet";

export const defaultBitcoinAccountConfig: WalletConfig = {
  symbol: "BTC",
  name: "Bitcoin",
  chain: "Bitcoin",
  isTestnet: config.IsTestNet,
};
