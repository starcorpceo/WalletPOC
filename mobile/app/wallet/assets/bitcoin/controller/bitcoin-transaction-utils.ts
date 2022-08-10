import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import * as bitcoin from "der-bitcoinjs-lib";
import { fetchFromTatum, HttpMethod } from "lib/http";
import { signEcdsa } from "lib/mpc";
import "shim";
import { Address, Balance, CoinTypeAccount, Fees, Input, Output, Transaction, UTXO } from "wallet/types/wallet";
import endpoints from "../blockchain/endpoints";
import { BitcoinWallet } from "../types/bitcoin";
import { getAllTransactionsCache } from "./bitcoin-transaction";

//New adopted functions
//---------------------------------------
//---------------------------------------
//---------------------------------------
//---------------------------------------

/**
 * Returns all external UTXOS from account
 * @param account
 * @returns
 */
export const getUTXOsCache = (account: CoinTypeAccount): Transaction[] => {
  const utxosExternal = account.external.addresses.flatMap((address: Address) =>
    address.transactions.map((transaction: Transaction) => !isSTXO(transaction, account) && transaction)
  );
  const utxosInternal = account.internal.addresses.flatMap((address: Address) =>
    address.transactions.map((transaction: Transaction) => !isSTXO(transaction, account) && transaction)
  );
  const utxos = [
    ...utxosExternal.filter((transaction): transaction is Transaction => !!transaction),
    ...utxosInternal.filter((transaction): transaction is Transaction => !!transaction),
  ];
  return utxos;
};

/**
 * Get oldest UTXOS based on total value
 * @param account
 * @param value value to be able to spend in satoshis
 * @returns
 */
export const getUTXOByValueCache = (
  account: CoinTypeAccount,
  value: number //in satoshis
): Transaction[] => {
  const allUTXOs = getUTXOsCache(account);

  allUTXOs.sort((a, b) => a.time - b.time);

  const { transactions } = allUTXOs.reduce(
    (acc, curr, _index, all) => {
      const { transactions, accumulatedValue } = acc;

      const utxoValue = getChangeFromUTXO(curr, account);

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

/**
 * check if transaction is spent transaction (STXO = Spent Transaction)
 * @param transaction
 * @param account
 * @returns
 */
const isSTXO = (transaction: Transaction, account: CoinTypeAccount): boolean =>
  getAllTransactionsCache(account).some((searchTransaction: Transaction) =>
    searchTransaction.inputs.find((input: Input) => input.prevout.hash === transaction.hash)
  );

//TODO check if code to check also internal can not cause problems

/**
 * find change (value in satoshis) from utxo to use in new transaction
 * @param utxo
 * @param account
 * @returns
 */
const getChangeFromUTXO = (utxo: Transaction, account: CoinTypeAccount): number => {
  const change = utxo.outputs.find(
    (output: Output) =>
      account.external.addresses.some((address: Address) => address.address === output.address) ||
      account.internal.addresses.some((address: Address) => address.address === output.address)
  );
  return change?.value || 0;
};

/**
 * finds own address int utxo output
 * @param utxo
 * @param account
 * @returns
 */
export const getAddressFromUTXOOutput = (utxo: Transaction, account: CoinTypeAccount): Address => {
  let address = account.external.addresses.find((address: Address) =>
    utxo.outputs.some((output: Output) => address.address === output.address)
  );
  if (!address)
    account.internal.addresses.find((address: Address) =>
      utxo.outputs.some((output: Output) => address.address === output.address)
    );
  return address!;
};

/**
 * finds the index in outputs in utxo which can be spent again and is in our control (a address from account)
 * @param utxo
 * @param account
 * @returns
 */
export const getChangeIndexFromUTXO = (utxo: Transaction, account: CoinTypeAccount): number => {
  return utxo.outputs.findIndex(
    (output: Output) =>
      account.external.addresses.some((address: Address) => address.address === output.address) ||
      account.internal.addresses.some((address: Address) => address.address === output.address)
  );
};

/**
 * find change (value in satoshis) from several utxos to use in new transaction - calls getChangeFromUTXO internally
 * @param transactions
 * @param account
 * @returns
 */
export const getChangeFromUTXOs = (transactions: Transaction[], account: CoinTypeAccount): number => {
  return transactions.reduce((prev, curr) => {
    return prev + getChangeFromUTXO(curr, account);
  }, 0);
};

/**
 * Get all inputs which are from other addresses than own account
 * @param transaction
 * @param account
 * @returns
 */
export const getOtherInputs = (transaction: Transaction, account: CoinTypeAccount): Input[] => {
  const otherInputs = transaction.inputs.filter(
    (input: Input) =>
      !(
        account.external.addresses.some((address: Address) => address.address === input.coin.address) ||
        account.internal.addresses.some((address: Address) => address.address === input.coin.address)
      )
  );
  return otherInputs;
};

/**
 * Get all outputs which are from other addresses than own account
 * @param transaction
 * @param account
 * @returns
 */
export const getOtherOutputs = (transaction: Transaction, account: CoinTypeAccount): Output[] => {
  const otherOutputs = transaction.outputs.filter(
    (output: Output) =>
      !(
        account.external.addresses.some((address: Address) => address.address === output.address) ||
        account.internal.addresses.some((address: Address) => address.address === output.address)
      )
  );
  return otherOutputs;
};

/**
 * Calculates net value of a transaction
 * @param transaction
 * @param account
 * @returns
 */
export const getNetValueFromTransaction = (transaction: Transaction, account: CoinTypeAccount): number => {
  const ownInputs = transaction.inputs.filter(
    (input: Input) =>
      account.external.addresses.some((address: Address) => address.address === input.coin.address) ||
      account.internal.addresses.some((address: Address) => address.address === input.coin.address)
  );
  const otherInputs = getOtherInputs(transaction, account);

  const ownOutputs = transaction.outputs.filter(
    (output: Output) =>
      account.external.addresses.some((address: Address) => address.address === output.address) ||
      account.internal.addresses.some((address: Address) => address.address === output.address)
  );
  const otherOutputs = getOtherOutputs(transaction, account);

  const ownInputValue = ownInputs.reduce((prev, curr) => {
    return prev + curr.coin.value;
  }, 0);

  const otherInputValue = otherInputs.reduce((prev, curr) => {
    return prev + curr.coin.value;
  }, 0);

  const ownOutputValue = ownOutputs.reduce((prev, curr) => {
    return prev + curr.value;
  }, 0);

  const otherOutputValue = ownOutputs.reduce((prev, curr) => {
    return prev + curr.value;
  }, 0);

  return ownOutputValue - ownInputValue;
};
