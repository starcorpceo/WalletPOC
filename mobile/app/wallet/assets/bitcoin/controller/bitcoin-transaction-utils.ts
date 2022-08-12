import { BitcoinTransaction, Input, Output } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import "shim";
import { Address, CoinTypeAccount } from "wallet/types/wallet";
import { getAllTransactionsCache } from "./bitcoin-transaction";

/**
 * Returns all external UTXOS from account
 * @param account
 * @returns
 */
export const getUTXOsCache = (account: CoinTypeAccount): BitcoinTransaction[] => {
  const utxosExternal = account.external.addresses.flatMap((address: Address) =>
    address.transactions.map((transaction: BitcoinTransaction) => !isSTXO(transaction, account) && transaction)
  );
  const utxosInternal = account.internal.addresses.flatMap((address: Address) =>
    address.transactions.map((transaction: BitcoinTransaction) => !isSTXO(transaction, account) && transaction)
  );
  const utxos = [
    ...utxosExternal.filter((transaction): transaction is BitcoinTransaction => !!transaction),
    ...utxosInternal.filter((transaction): transaction is BitcoinTransaction => !!transaction),
  ];

  const uniqueUtxos: BitcoinTransaction[] = [...new Map(utxos.map((utxo) => [utxo.hash, utxo])).values()];
  return uniqueUtxos;
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
): BitcoinTransaction[] => {
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
    { transactions: [] as BitcoinTransaction[], accumulatedValue: 0 }
  );
  return transactions;
};

/**
 * check if transaction is spent transaction (STXO = Spent Transaction)
 * @param transaction
 * @param account
 * @returns
 */
const isSTXO = (transaction: BitcoinTransaction, account: CoinTypeAccount): boolean =>
  getAllTransactionsCache(account).some((searchTransaction: BitcoinTransaction) =>
    searchTransaction.inputs.find((input: Input) => input.prevout.hash === transaction.hash)
  );

/**
 * find change (value in satoshis) from utxo to use in new transaction
 * @param utxo
 * @param account
 * @returns
 */
const getChangeFromUTXO = (utxo: BitcoinTransaction, account: CoinTypeAccount): number => {
  const change = utxo.outputs.find((output: Output) => hasOwnAddress(output.address, account));
  return change?.value || 0;
};

/**
 * checks if address is one of users addresses
 * @param address
 * @param account
 * @returns
 */
const hasOwnAddress = (address: string, account: CoinTypeAccount): boolean => {
  return (
    account.external.addresses.some((externalAddress: Address) => externalAddress.address === address) ||
    account.internal.addresses.some((internalAddress: Address) => internalAddress.address === address)
  );
};

/**
 * checks if address is not users address
 * @param address
 * @param account
 * @returns
 */
const hasOtherAddress = (address: string, account: CoinTypeAccount): boolean => {
  return !(
    account.external.addresses.some((externalAddress: Address) => externalAddress.address === address) ||
    account.internal.addresses.some((internalAddress: Address) => internalAddress.address === address)
  );
};

/**
 * finds own address int utxo output
 * @param utxo
 * @param account
 * @returns
 */
export const getAddressFromUTXOOutput = (utxo: BitcoinTransaction, account: CoinTypeAccount): Address => {
  let address = account.external.addresses.find((address: Address) =>
    utxo.outputs.some((output: Output) => address.address === output.address)
  );
  if (!address)
    address = account.internal.addresses.find((address: Address) =>
      utxo.outputs.some((output: Output) => address.address == output.address)
    );
  return address!;
};

/**
 * finds the index in outputs in utxo which can be spent again and is in our control (a address from account)
 * @param utxo
 * @param account
 * @returns
 */
export const getChangeIndexFromUTXO = (utxo: BitcoinTransaction, account: CoinTypeAccount): number => {
  return utxo.outputs.findIndex((output: Output) => hasOwnAddress(output.address, account));
};

/**
 * find change (value in satoshis) from several utxos to use in new transaction - calls getChangeFromUTXO internally
 * @param transactions
 * @param account
 * @returns
 */
export const getChangeFromUTXOs = (transactions: BitcoinTransaction[], account: CoinTypeAccount): number => {
  return transactions.reduce((prev, curr) => {
    return prev + getChangeFromUTXO(curr, account);
  }, 0);
};

/**
 * Get all inputs which are from addresses from own account
 * @param transaction
 * @param account
 * @returns
 */
export const getOwnInputs = (transaction: BitcoinTransaction, account: CoinTypeAccount): Input[] => {
  const ownInputs = transaction.inputs.filter((input: Input) => hasOwnAddress(input.coin.address, account));
  return ownInputs;
};

/**
 * Get all inputs which are from other addresses than own account
 * @param transaction
 * @param account
 * @returns
 */
export const getOtherInputs = (transaction: BitcoinTransaction, account: CoinTypeAccount): Input[] => {
  const otherInputs = transaction.inputs.filter((input: Input) => hasOtherAddress(input.coin.address, account));
  return otherInputs;
};

/**
 * Get all outputs which are from addresses from own account
 * @param transaction
 * @param account
 * @returns
 */
export const getOwnOutputs = (transaction: BitcoinTransaction, account: CoinTypeAccount): Output[] => {
  const ownOutputs = transaction.outputs.filter((output: Output) => hasOwnAddress(output.address, account));
  return ownOutputs;
};

/**
 * Get all outputs which are from other addresses than own account
 * @param transaction
 * @param account
 * @returns
 */
export const getOtherOutputs = (transaction: BitcoinTransaction, account: CoinTypeAccount): Output[] => {
  const otherOutputs = transaction.outputs.filter((output: Output) => hasOtherAddress(output.address, account));
  return otherOutputs;
};

/**
 * Calculates net value of a transaction
 * @param transaction
 * @param account
 * @returns
 */
export const getNetValueFromTransaction = (transaction: BitcoinTransaction, account: CoinTypeAccount): number => {
  const ownInputs = transaction.inputs.filter((input: Input) => hasOwnAddress(input.coin.address, account));

  const ownOutputs = transaction.outputs.filter((output: Output) => hasOwnAddress(output.address, account));

  const ownInputValue = ownInputs.reduce((prev, curr) => {
    return prev + curr.coin.value;
  }, 0);

  const ownOutputValue = ownOutputs.reduce((prev, curr) => {
    return prev + curr.value;
  }, 0);

  return ownOutputValue - ownInputValue;
};
