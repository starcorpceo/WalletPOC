import { BitcoinWalletsState } from "bitcoin/state/atoms";
import { fetchFromTatum, HttpMethod } from "lib/http";
import "shim";
import endpoints from "wallet/endpoints";
import {
  Balance,
  CryptoWallet,
  Input,
  Fees,
  Output,
  Transaction,
  UTXO,
} from "wallet/wallet";
import * as bitcoin from "bitcoinjs-lib";
import { signEcdsa } from "lib/mpc";
import { BitcoinWallet } from "..";
import { ShareWallet, Wallet } from "../../../api-types/wallet";
import { User } from "../../../api-types/user";
import { config } from "config/config";

export const getBalance = (wallet: CryptoWallet): Promise<Balance> => {
  return fetchFromTatum<Balance>(
    endpoints.bitcoin.balance(wallet.config.address)
  );
};

export const getLatestTransactions = (
  wallet: CryptoWallet,
  pageSize: number = 10,
  offset: number = 0
): Promise<Transaction[]> => {
  const query = new URLSearchParams({
    pageSize: pageSize.toString(),
    offset: offset.toString(),
  });

  return fetchFromTatum<Transaction[]>(
    endpoints.bitcoin.transaction(wallet.config.address, query)
  );
};

export const getNetValue = (
  wallet: CryptoWallet,
  transaction: Transaction
): number => {
  var fullValueInput = 0;
  var fullValueReturn = 0;

  transaction.inputs.forEach((input) => {
    if (input.coin.address == wallet.config.address) {
      fullValueInput += input.coin.value;
    }
  });

  transaction.outputs.forEach((output) => {
    if (output.address == wallet.config.address) {
      fullValueReturn += output.value;
    }
  });

  return -fullValueInput + fullValueReturn;
};

export const getUnspentTransactions = async (
  wallet: CryptoWallet
): Promise<UTXO[]> => {
  const unspent = Promise.all(
    wallet.transactions.flatMap((transaction: Transaction) =>
      transaction.outputs.map(async (output: Output, index) => {
        if (
          !isTransactionSpent(transaction, wallet) &&
          output.address === wallet.config.address
        )
          return fetchFromTatum<UTXO>(
            endpoints.bitcoin.utxo(transaction.hash, index)
          );
      })
    )
  );

  return (await unspent).filter((out): out is UTXO => !!out);
};

export const getUnspentTransactionsSync = (wallet: CryptoWallet) => {
  const unspent = wallet.transactions.flatMap((transaction: Transaction) =>
    transaction.outputs.map(
      (output: Output, index) =>
        !isTransactionSpent(transaction, wallet) &&
        output.address === wallet.config.address &&
        transaction
    )
  );

  return unspent.filter(
    (transaction): transaction is Transaction => !!transaction
  );
};

const isTransactionSpent = (
  transaction: Transaction,
  wallet: CryptoWallet
): boolean =>
  wallet.transactions.some((searchTransaction: Transaction) =>
    searchTransaction.inputs.find(
      (input: Input) => input.prevout.hash === transaction.hash
    )
  );

const getChangeFromUTXO = (
  transaction: Transaction,
  wallet: CryptoWallet
): Output | null => {
  var change: Output | null = null;
  transaction.outputs.map((output: Output, index) => {
    if (output.address === wallet.config.address) {
      change = output;
    }
  });
  return change;
};

const estimateFeeFromUTXO = (
  from: Transaction[],
  to: Transaction[]
): Promise<Fees> => {
  const fromUTXO = from.flatMap;
  return fetchFromTatum<Fees>(endpoints.bitcoin.fees(), {
    method: HttpMethod.POST,
    body: { chain: "BTC", type: "TRANSFER", fromUTXO: [], to: [] },
  });
};

export const prepareTransaction = (
  wallet: BitcoinWallet,
  mpcWallet: ShareWallet,
  user: User,
  toAddress: string,
  value: number
): bitcoin.Psbt => {
  const from = getUTXOByValue(wallet, value);

  const psbt = new bitcoin.Psbt({ network: config.BCNetwork });

  //add transaction input - oldest utxos with enough value
  from.map((transaction) => {
    psbt.addInput({
      hash: transaction.hash,
      index: getChangeIndexFromTransaction(wallet, transaction),
      nonWitnessUtxo: Buffer.from(transaction.hex, "hex"),
    });
  });

  // const psbt = new bitcoin.Psbt({ network: config.BCNetwork })
  //   .addInput({
  //     hash: transactions[0].hash,
  //     index: 1, //transactions[0].index,
  //     nonWitnessUtxo: Buffer.from(transactions[0].hex, "hex"),
  //   })
  //   .addOutput({
  //     address: "mxuQMQAsnbYTRqWhenF1Hj4qf5CvcE8L8c",
  //     value: 0.0001 * 100000000,
  //   })
  //   .addOutput({
  //     address: address,
  //     value:
  //       transactions[0].outputs[1].value -
  //       0.0001 * 100000000 -
  //       0.00005 * 100000000,
  //   });
};

const prepareSigner = (
  wallet: BitcoinWallet,
  mpcWallet: ShareWallet,
  user: User
): bitcoin.SignerAsync => {
  const ec: bitcoin.SignerAsync = {
    publicKey: wallet.config.publicKey as Buffer,
    sign: async (hash) => {
      const sig = Buffer.from(
        await signEcdsa(
          user.devicePublicKey,
          user.id,
          mpcWallet.id,
          mpcWallet.mainShare,
          hash.toString()
        ),
        "base64"
      );
      return sig;
    },
  };
  return ec;
};

const getUTXOByValue = (
  wallet: BitcoinWallet,
  value: number
): Transaction[] => {
  const allUTXOs = getUnspentTransactionsSync(wallet);
  var acc = 0;
  const utxos = allUTXOs.filter((transaction) => {
    //TODO calc fees into minimal value of utxos, so used utxos together have enough value for transaction and fees
    const utxoValue = getChangeFromUTXO(transaction, wallet)!.value;
    if (utxoValue + acc > value) return true;
    acc += utxoValue;
  });
  return utxos;
};

const getChangeIndexFromTransaction = (
  wallet: BitcoinWallet,
  transaction: Transaction
): number => {
  var index = 0;
  transaction.outputs.map((output, i) => {
    if (output.address === wallet.config.address) index = i;
  });
  return index;
};
