import {
  getBalance,
  getLatestTransactions,
  getNetValue,
  getUnspentTransactions,
  getUnspentTransactionsSync,
  prepareTransaction,
} from "bitcoin/controller/bitcoin-wallet";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useEffect } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { BitcoinWallet } from "wallet/bitcoin";
import { Balance, Transaction } from "wallet/wallet";

type BitcoinWalletProps = {
  wallet: BitcoinWallet;
  index: number;
};

const BitcoinWalletView = ({ wallet, index }: BitcoinWalletProps) => {
  const setBitcoinState = useSetRecoilState(bitcoinWalletsState);
  const auth = useRecoilValue<AuthState>(authState);

  useEffect(() => {
    getUnspentTransactions(wallet).then((res) =>
      console.log("Got Unspent with Tatum:", res)
    );

    console.log(
      "Got unspent with local Data",
      getUnspentTransactionsSync(wallet)
    );

    prepareTransaction(wallet, , auth,"testAddress", 100)
  }, []);

  return (
    <View key={"wallet-" + index}>
      <Text>Address: {wallet?.config.address}</Text>

      <>
        {wallet.balance && (
          <Text>
            Balance: {wallet.balance.incoming - wallet.balance.outgoing} BTC
          </Text>
        )}
        <Button
          onPress={async () => {
            updateBalance(await getBalance(wallet), index, setBitcoinState);
          }}
          title="Fetch Balance"
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
        title="Fetch Transactions"
      />
      {wallet?.transactions.map((t) => {
        const netValue = getNetValue(wallet, t);
        return (
          <View
            key={t.hash}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: netValue < 0 ? "red" : "green" }}>
              {netValue} Satoshis
            </Text>
          </View>
        );
      })}
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Button
          onPress={async () => {
            updateBalance(await getBalance(wallet), index, setBitcoinState);
          }}
          title="send"
        />
        <View>
          <TextInput placeholder="to"></TextInput>
          <TextInput placeholder="0 sats"></TextInput>
        </View>
      </View>
    </View>
  );
};

const updateBalance = (
  balance: Balance,
  index: number,
  setState: SetterOrUpdater<BitcoinWalletsState>
): void => {
  setState((currentState: BitcoinWalletsState) => ({
    ...currentState,
    accounts: [
      ...currentState.accounts.slice(0, index),
      { ...currentState.accounts[index], balance },
      ...currentState.accounts.slice(index + 1),
    ],
  }));
};

const updateTransactions = (
  transactions: Transaction[],
  index: number,
  setState: SetterOrUpdater<BitcoinWalletsState>
): void => {
  setState((currentState: BitcoinWalletsState) => ({
    ...currentState,
    accounts: [
      ...currentState.accounts.slice(0, index),
      { ...currentState.accounts[index], transactions },
      ...currentState.accounts.slice(index + 1),
    ],
  }));
};

export default BitcoinWalletView;
