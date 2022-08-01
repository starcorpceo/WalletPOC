import { config } from "config/config";
import "shim";

import * as bitcoin from "der-bitcoinjs-lib";

import ec from "lib/elliptic";

export const mpcPublicKeyToBitcoinAddress = (publicKey: string): string => {
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
