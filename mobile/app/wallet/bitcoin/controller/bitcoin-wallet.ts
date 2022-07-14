import { fetchFromTatum } from "lib/http";
import "shim";
import endpoints from "wallet/endpoints";
import {
  Balance,
  CryptoWallet,
  Input,
  Output,
  Transaction,
  UTXO,
} from "wallet/wallet";

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
