import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import * as bitcoin from "der-bitcoinjs-lib";
import { BitcoinService } from "packages/blockchain-api-client/src";
import { BroadcastTransaction } from "packages/blockchain-api-client/src/base/types";
import { BitcoinProviderEnum } from "packages/blockchain-api-client/src/blockchains/bitcoin/bitcoin-factory";
import { BitcoinTransaction } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import { Address, CoinTypeAccount, Fees } from "wallet/types/wallet";
import { getNextUnusedAddress } from "./bitcoin-address";
import { prepareSingleSigner } from "./bitcoin-signer";
import {
  getAddressFromUTXOOutput,
  getChangeFromUTXOs,
  getChangeIndexFromUTXO,
  getUTXOByValueCache,
} from "./bitcoin-transaction-utils";
import { BitcoinToSatoshis } from "./bitcoin-utils";

/**
 * Get all transactions from account, only from state
 * @param account
 * @returns
 */
export const getAllTransactionsCache = (account: CoinTypeAccount): BitcoinTransaction[] => {
  let transactions: BitcoinTransaction[] = [];
  account.external.addresses.map((address) =>
    address.transactions.map((transaction) => {
      transactions.push(transaction);
    })
  );
  account.internal.addresses.map((address) =>
    address.transactions.map((transaction) => {
      transactions.push(transaction);
    })
  );
  const uniqueTransaction: BitcoinTransaction[] = [
    ...new Map(transactions.map((transaction) => [transaction.hash, transaction])).values(),
  ];
  return uniqueTransaction;
};

type PreparedTransactions = {
  preparedTransactions: bitcoin.Psbt;
  preparedSigners: bitcoin.SignerAsync[];
};

/**
 * Prepares Transaction for sending
 * @param account
 * @param address
 * @param amount
 */
//TODO function can only use one output address in next transaction - iterate outputs for all addresses owned by user and be able to use it
export const prepareTransactionP2PKH = async (
  user: User,
  account: CoinTypeAccount,
  address: string,
  amount: number
): Promise<PreparedTransactions> => {
  //finds oldest transactions to use in new transaction with enough value
  const utxos = getUTXOByValueCache(account, amount);

  const psbt = new bitcoin.Psbt({ network: config.BCNetwork });

  let signers: bitcoin.SignerAsync[] = [];

  //add utxos as input for transaction
  utxos.map((utxo) => {
    psbt.addInput({
      hash: utxo.hash,
      index: getChangeIndexFromUTXO(utxo, account),
      nonWitnessUtxo: Buffer.from(utxo.hex, "hex"),
    });
    //add prepared signer to signers array
    signers.push(prepareSingleSigner(user, getAddressFromUTXOOutput(utxo, account)));
  });

  //add address from receiver to output
  try {
    psbt.addOutput({
      address: address,
      value: amount,
    });
  } catch (err) {
    console.log(err, "Receiver address is possibly not an bitcoin address");
  }

  //generate own unused internal change address
  const unusedAddress: Address = await getNextUnusedAddress(user, account, "internal");

  //change value without fees
  let changeValue = getChangeFromUTXOs(utxos, account) - amount;
  if (changeValue < 0) throw new Error("Insufficient funds before fees"); //TODO if amount is exactly amount of used utxo then it will fail after fees

  //calculate fees for transaction
  const bitcoinService = new BitcoinService("TEST");
  const fees: Fees = await bitcoinService.getFees(
    "BTC",
    "TRANSFER",
    utxos.map((utxo) => {
      return { txHash: utxo.hash, index: getChangeIndexFromUTXO(utxo, account) };
    }),
    [
      { address: address, value: amount },
      { address: unusedAddress.address, value: changeValue },
    ],
    BitcoinProviderEnum.TATUM
  );

  //check if user have sufficient funds
  changeValue = changeValue - BitcoinToSatoshis(fees.medium);
  if (changeValue < 0) throw new Error("Insufficient funds after medium fees - could lower fees");

  //add change address and calculated return value to output
  psbt.addOutput({
    address: unusedAddress.address,
    value: changeValue,
  });

  return { preparedTransactions: psbt, preparedSigners: signers };
};

/**
 * Broadcasts a signed bitcoin transaction via TATUM
 * @param transaction Signed transaction
 * @returns
 */
export const broadcastTransaction = async (transaction: bitcoin.Psbt): Promise<BroadcastTransaction> => {
  const bitcoinService = new BitcoinService("TEST");
  const broadcastTransaction: BroadcastTransaction = await bitcoinService.sendBroadcastTransaction(
    transaction.extractTransaction().toHex(),
    BitcoinProviderEnum.TATUM
  );
  if (broadcastTransaction.failed) throw new Error("Failed to broadcast transaction");
  return broadcastTransaction;
};
