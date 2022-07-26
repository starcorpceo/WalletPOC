import "shim";

import { config } from "config/config";
import * as bitcoin from "der-bitcoinjs-lib";
import ec from "lib/elliptic";
import { deriveNonHardenedShare } from "lib/mpc/deriveBip32";
import { MPCWalletToWalletConfig } from "wallet/controller/generator";
import { BitcoinWallet } from "..";
import { MPCWallet } from "../../../api-types/wallet";

export const mpcWalletToBitcoinWallet: MPCWalletToWalletConfig<
  BitcoinWallet
> = async (mpcWallet: MPCWallet) => {
  const internalShare = await deriveNonHardenedShare(mpcWallet.keyShare, "1");
  const externalShare = await deriveNonHardenedShare(mpcWallet.keyShare, "0");

  return {
    transactions: [],
    mpcWallet,
    internal: {
      share: internalShare,
      addresses: [],
    },
    external: {
      share: externalShare,
      addresses: [],
    },
  };
};

const mpcPublicKeyToBitcoinAddress = (publicKey: string): string => {
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

  return address || "";
};
