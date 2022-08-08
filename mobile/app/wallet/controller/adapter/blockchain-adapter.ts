import { WalletConfig } from "wallet/types/wallet";
import { publicKeyToBitcoinAddress } from "../../assets/bitcoin/controller/adapter/bitcoin-adapter";

type PublicKeyToAddress = (publicKey: string) => string;

export const getPublicKeyToAddressAdapter = (config: WalletConfig): PublicKeyToAddress => {
  switch (config.chain) {
    case "BTC":
      return publicKeyToBitcoinAddress;
    default:
      return publicKeyToBitcoinAddress;
  }
};
