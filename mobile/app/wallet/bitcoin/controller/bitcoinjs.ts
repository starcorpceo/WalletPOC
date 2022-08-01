import { config } from "config/config";
import "shim";

import * as bitcoin from "der-bitcoinjs-lib";

import { BitcoinWalletsState, initialBitcoinState } from "bitcoin/state/atoms";
import constants from "config/constants";
import ec from "lib/elliptic";
import { deepCompare } from "lib/string";
import { deriveToMpcWallet } from "wallet/controller/generator";
import { User } from "../../../api-types/user";
import { MPCWallet } from "../../../api-types/wallet";

export const createBitcoinAccount = async (
  bitcoinState: BitcoinWalletsState,
  user: User,
  purposeWallet: MPCWallet
) => {
  if (walletExists(bitcoinState)) {
    return;
  }

  const bitcoinTypeWallet = await getBitcoinTypeWallet(
    bitcoinState,
    user,
    purposeWallet
  );

  const newIndex = bitcoinState.accounts.length;

  const accountMpcWallet = await deriveToMpcWallet(
    bitcoinTypeWallet,
    user,
    newIndex.toString(),
    true
  );

  return { bitcoinTypeWallet, accountMpcWallet };
};

const getBitcoinTypeWallet = async (
  state: BitcoinWalletsState,
  user: User,
  purposeWallet: MPCWallet
): Promise<MPCWallet> => {
  console.log("comparing", {
    current: state.coinTypeWallet,
    initial: initialBitcoinState.coinTypeWallet,
  });
  if (
    deepCompare(
      state.coinTypeWallet.mpcWallet,
      initialBitcoinState.coinTypeWallet.mpcWallet
    )
  )
    return await deriveToMpcWallet(
      purposeWallet,
      user,
      constants.bip44BitcoinCoinType,
      true
    );

  return state.coinTypeWallet.mpcWallet;
};

const walletExists = (bitcoinState: BitcoinWalletsState): boolean =>
  bitcoinState &&
  !!bitcoinState?.coinTypeWallet &&
  bitcoinState.accounts.length > 0;

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
