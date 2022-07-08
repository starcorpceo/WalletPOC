import {
  BitcoinWallets,
  getBalance,
  getLatestTransactions,
} from "bitcoin/controller/bitcoin-wallet";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React from "react";
import { Button, Text, View } from "react-native";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { Balance, Transaction } from "wallet/wallet";

type BitcoinWalletProps = {
  wallet: BitcoinWallets;
  index: number;
};

const BitcoinWallet = ({ wallet, index }: BitcoinWalletProps) => {
  const setBitcoinState = useSetRecoilState(bitcoinWalletsState);
  return (
    <View key={"wallet-" + index}>
      <Text>Address: {wallet?.config.address}</Text>

      <>
        <Text>Balance: {wallet?.balance?.incoming} BTC</Text>
        <Button
          onPress={async () => {
            updateBalance(await getBalance(wallet), index, setBitcoinState);
          }}
          title="refresh"
        />
      </>

      <Button
        onPress={async () => {
          updateTransactions(
            await getLatestTransactions(wallet, 10, 0),
            index,
            setBitcoinState
          );
        }}
        title="load transac"
      />
      {wallet?.transactions.map((t) => {
        return (
          <Text key={t.hash}> + {t.outputs[1].value / 100000000} BTC</Text>
        );
      })}
    </View>
  );
};

const updateBalance = (
  balance: Balance,
  index: number,
  setState: SetterOrUpdater<BitcoinWalletsState>
): void => {
  setState((currentState: BitcoinWalletsState) => [
    ...currentState.slice(0, index),
    { ...currentState[index], balance },
    ...currentState.slice(index + 1),
  ]);
};

const updateTransactions = (
  transactions: Transaction[],
  index: number,
  setState: SetterOrUpdater<BitcoinWalletsState>
): void => {
  setState((currentState: BitcoinWalletsState) => [
    ...currentState.slice(0, index),
    { ...currentState[index], transactions },
    ...currentState.slice(index + 1),
  ]);
};

export default BitcoinWallet;
