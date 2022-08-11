import { publicKeyToEthereumAddress } from "ethereum/controller/ethereum-adapter";
import { WalletConfig } from "wallet/types/wallet";
import { publicKeyToBitcoinAddressP2PKH } from "../../assets/bitcoin/controller/adapter/bitcoin-adapter";

export type AddressAndPublicKey = {
  address: string;
  publicKey: string;
};

type PublicKeyToAddress = (publicKey: string) => AddressAndPublicKey;

export const getPublicKeyToAddressAdapter = (config: WalletConfig): PublicKeyToAddress => {
  switch (config.symbol) {
    case "BTC":
      return publicKeyToBitcoinAddressP2PKH;
    case "ETH":
      return publicKeyToEthereumAddress;
    default:
      return publicKeyToBitcoinAddressP2PKH;
  }
};
