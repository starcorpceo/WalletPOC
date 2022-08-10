import { WalletConfig } from "wallet/types/wallet";
import {
  publicKeyToBitcoinAddressP2PKH,
  publicKeyToBitcoinAddressP2WPKH,
} from "../../assets/bitcoin/controller/adapter/bitcoin-adapter";

export type AddressAndPublicKey = {
  address: string;
  publicKey: Buffer;
};

type PublicKeyToAddress = (publicKey: string) => AddressAndPublicKey;

export const getPublicKeyToAddressAdapter = (config: WalletConfig): PublicKeyToAddress => {
  switch (config.chain) {
    case "BTC":
      return publicKeyToBitcoinAddressP2PKH;
    default:
      return publicKeyToBitcoinAddressP2PKH;
  }
};
