import {
  getBalance,
  getLatestTransactions,
} from "bitcoin/controller/bitcoin-wallet";
import React from "react";
import { Button, Text, View } from "react-native";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { Balance, Transaction } from "wallet/wallet";
import Wallet from "wallet/wallet-view";
import { BitcoinWalletsState, btcWalletsState } from "../state/atoms";
import GenerateWallet from "./generate-wallet";
import ImportWallet from "./import-wallet";

const BitcoinWallet = () => {
  const [bitcoinState, setBitcoinState] = useRecoilState(btcWalletsState);

  console.log("rendering bitcoin wallets", bitcoinState);

  return (
    <Wallet>
      <>
        {!walletExists(bitcoinState) && (
          <>
            <ImportWallet />
            <GenerateWallet />
          </>
        )}
        <Text>Custom Bitcoin stuff</Text>

        {bitcoinState.map((wallet, index) => (
          <View key={"wallet-" + index}>
            <Text>Address: {wallet?.config.address}</Text>

            <>
              <Text>Balance: {wallet?.balance?.incoming} BTC</Text>
              <Button
                onPress={async () => {
                  updateBalance(
                    await getBalance(wallet),
                    index,
                    setBitcoinState
                  );
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
                <Text key={t.hash}>
                  {" "}
                  + {t.outputs[1].value / 100000000} BTC
                </Text>
              );
            })}
          </View>
        ))}
      </>
    </Wallet>
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

const walletExists = (bitcoinState: BitcoinWalletsState): boolean =>
  bitcoinState && bitcoinState.length > 0;

export default BitcoinWallet;
