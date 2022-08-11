import { config } from "bitcoin/config/bitcoin-config";
import "shim";

import * as bitcoin from "der-bitcoinjs-lib";

import ec from "lib/elliptic";
import { AddressAndPublicKey } from "wallet/controller/adapter/blockchain-adapter";

/**
 * Transforms bitcoin public key to bitcoin p2pkh address
 * @param publicKey public key from mpc creation
 * @returns string bitcoin p2pkh address
 */

export const publicKeyToBitcoinAddressP2PKH = (publicKey: string): AddressAndPublicKey => {
  const ecPair = ec.keyFromPublic([...Buffer.from(publicKey, "base64")].slice(23));

  const pubKeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");
  const pubkeyECPair = bitcoin.ECPair.fromPublicKey(pubKeyBuf);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: pubkeyECPair.publicKey,
    network: config.BCNetwork,
  });

  if (!address) {
    // TODO: Error handling frontend display or smth
    console.error("Not able to transform MPC Public Key to Bitcoin address, fool");
  }

  return { address: address || "", publicKey: pubkeyECPair.publicKey.toString("base64") };
};

/**
 * Transforms bitcoin public key to bitcoin p2wpkh address (segwit)
 * @param publicKey public key from mpc creation
 * @returns string bitcoin p2wpkh address
 */

export const publicKeyToBitcoinAddressP2WPKH = (publicKey: string): AddressAndPublicKey => {
  const ecPair = ec.keyFromPublic([...Buffer.from(publicKey, "base64")].slice(23));

  const pubKeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");
  const pubkeyECPair = bitcoin.ECPair.fromPublicKey(pubKeyBuf);

  const { address } = bitcoin.payments.p2wpkh({
    pubkey: pubkeyECPair.publicKey,
    network: config.BCNetwork,
  });

  if (!address) {
    // TODO: Error handling frontend display or smth
    console.error("Not able to transform MPC Public Key to Bitcoin address, fool");
  }

  return { address: address || "", publicKey: pubkeyECPair.publicKey.toString("base64") };
};
