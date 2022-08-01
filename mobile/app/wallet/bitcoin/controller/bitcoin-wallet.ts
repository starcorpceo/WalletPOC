import { User } from "api-types/user";
import { config } from "config/config";
import * as bitcoin from "der-bitcoinjs-lib";
import { fetchFromTatum, HttpMethod } from "lib/http";
import { signEcdsa } from "lib/mpc";
import "shim";
import endpoints from "wallet/endpoints";
import {
  Balance,
  CryptoWallet,
  Fees,
  Input,
  Output,
  Transaction,
  UTXO,
} from "wallet/wallet";
import { BitcoinWallet } from "..";

export const getBalance = (address: string): Promise<Balance> => {
  return fetchFromTatum<Balance>(endpoints.bitcoin.balance(address));
};

export const broadcastTransaction = (hex: string): Promise<any> => {
  return fetchFromTatum<any>(endpoints.bitcoin.broadcastTransaction(), {
    method: HttpMethod.POST,
    body: { txData: hex },
  });
};

export const getLatestTransactions = (
  address: string,
  pageSize: number = 10,
  offset: number = 0
): Promise<Transaction[]> => {
  const query = new URLSearchParams({
    pageSize: pageSize.toString(),
    offset: offset.toString(),
  });

  return fetchFromTatum<Transaction[]>(
    endpoints.bitcoin.transaction(address, query)
  );
};

export const getNetValue = (
  address: string,
  transaction: Transaction
): number => {
  var fullValueInput = 0;
  var fullValueReturn = 0;

  transaction.inputs.forEach((input) => {
    if (input.coin.address == address) {
      fullValueInput += input.coin.value;
    }
  });

  transaction.outputs.forEach((output) => {
    if (output.address == address) {
      fullValueReturn += output.value;
    }
  });

  return -fullValueInput + fullValueReturn;
};

export const getUnspentTransactions = async (
  transactions: Transaction[],
  address: string
): Promise<UTXO[]> => {
  const unspent = Promise.all(
    transactions.flatMap((transaction: Transaction) =>
      transaction.outputs.map(async (output: Output, index) => {
        if (
          !isTransactionSpent(transaction, wallet) &&
          output.address === address
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
      (output: Output) =>
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
  allTransactions: Transaction[]
): boolean =>
  allTransactions.some((searchTransaction: Transaction) =>
    searchTransaction.inputs.find(
      (input: Input) => input.prevout.hash === transaction.hash
    )
  );

const getChangeFromUTXO = (
  transaction: Transaction,
  address: string
): number => {
  const change = transaction.outputs.find(
    (output: Output) => output.address === address
  );

  return change?.value || 0;
};

const getChangeValueFromUTXOs = (
  transactions: Transaction[],
  address: string
): number => {
  return transactions.reduce((prev, curr) => {
    return prev + getChangeFromUTXO(curr, address);
  }, 0);
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
  user: User,
  toAddress: string,
  value: number
): bitcoin.Psbt => {
  const fee = 500; //TODO satoshis fee, should be loaded from api
  const from = getUTXOByValue(wallet, value); //working

  const psbt = new bitcoin.Psbt({ network: config.BCNetwork });

  //add transaction input - oldest utxos with enough value
  from.map((transaction) => {
    psbt.addInput({
      hash: transaction.hash,
      index: getChangeIndexFromTransaction(wallet, transaction),
      nonWitnessUtxo: Buffer.from(transaction.hex, "hex"),
    });
  });

  //output reciever address
  psbt.addOutput({
    address: toAddress,
    value: value,
  });

  //change
  //TODO derive change address
  psbt.addOutput({
    address: wallet.config.address,
    value: getChangeValueFromUTXOs(from, wallet) - value - fee,
  });

  return psbt;
};

export const signTransaction = async (
  transaction: bitcoin.Psbt,
  signer: bitcoin.SignerAsync
): Promise<bitcoin.Psbt> => {
  await transaction.signAllInputsAsync(signer);
  const validated = transaction.validateSignaturesOfAllInputs();
  console.log("Input signatures look ok: ", validated);
  transaction.finalizeAllInputs();

  return transaction;
};

export const prepareSigner = (
  wallet: BitcoinWallet,
  user: User
): bitcoin.SignerAsync => {
  const ec: bitcoin.SignerAsync = {
    publicKey: wallet.config.publicKey as Buffer,
    sign: async (hash: Buffer) =>
      Buffer.from([
        ...Buffer.from(
          await signEcdsa(
            user.devicePublicKey,
            user.id,
            wallet.mpcWallet.id,
            wallet.mpcWallet.keyShare,
            hash.toString("base64"),
            "base64"
          ),
          "base64"
        ),
        0x01,
      ]),
  };
  return ec;
};

const getUTXOByValue = (
  wallet: BitcoinWallet,
  value: number //in satoshis
): Transaction[] => {
  const allUTXOs = getUnspentTransactionsSync(wallet);

  allUTXOs.sort((a, b) => a.time - b.time);

  const { transactions } = allUTXOs.reduce(
    (acc, curr, _index, all) => {
      const { transactions, accumulatedValue } = acc;

      const utxoValue = getChangeFromUTXO(curr, wallet);

      if (accumulatedValue >= value) {
        return acc;
      }

      return {
        transactions: [...transactions, curr],
        accumulatedValue: accumulatedValue + utxoValue,
      };
    },
    { transactions: [] as Transaction[], accumulatedValue: 0 }
  );

  return transactions;
};

const getChangeIndexFromTransaction = (
  wallet: BitcoinWallet,
  transaction: Transaction
): number => {
  return transaction.outputs.findIndex(
    (output) => output.address === wallet.config.address
  );
};
