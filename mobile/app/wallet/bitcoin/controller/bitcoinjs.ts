import "shim";

import * as bitcoin from "bitcoinjs-lib";
import { config } from "config/config";
import { PubKeyToWalletConfig } from "wallet/generator";
import { BitcoinWallet } from "..";

export const pubKeyTransformer: PubKeyToWalletConfig<BitcoinWallet> = (
  pubKeyBuf: Buffer
) => {
  const pubkeyECPair = bitcoin.ECPair.fromPublicKey(pubKeyBuf);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: pubkeyECPair.publicKey,
    network: config.BCNetwork,
  });

  if (!address) {
    // TODO: Error handling frontend display or smth
    console.error(
      "Not able to transform MPC Public Key to Bitcoin address, fool"
    );
  }

  return {
    config: {
      symbol: "BTC",
      name: "Bitcoin",
      chain: "Bitcoin",
      address: address || "",
      publicKey: pubkeyECPair.publicKey,
      isTestnet: true,
    },
    transactions: [],
  };
};
