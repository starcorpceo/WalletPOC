import "shim";

import { config } from "config/config";
import * as bitcoin from "der-bitcoinjs-lib";
import ec from "lib/elliptic";
import { getPublicKey } from "react-native-blockchain-crypto-mpc";
import { MPCWalletToWalletConfig } from "wallet/controller/generator";
import { BitcoinWallet } from "..";
import { MPCWallet } from "../../../api-types/wallet";

export const mpcWalletToBitcoinWallet: MPCWalletToWalletConfig<
  BitcoinWallet
> = async (mpcWallet: MPCWallet) => {
  const publicKey = await getPublicKey(mpcWallet.keyShare);

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
    mpcWallet,
  };
};
