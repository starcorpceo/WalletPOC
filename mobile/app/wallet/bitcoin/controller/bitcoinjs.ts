import "shim";

import * as bitcoin from "bitcoinjs-lib";
import { config } from "config/config";
import ec from "lib/elliptic";
import { PubKeyToWalletConfig } from "wallet/controller/generator";
import { BitcoinWallet } from "..";

export const pubKeyTransformer: PubKeyToWalletConfig<BitcoinWallet> = (
  publicKey: string
) => {
  const ecPair = ec.keyFromPublic(
    [...Buffer.from(publicKey, "base64")].slice(23)
  );

  const pubKeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");
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
