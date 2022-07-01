import * as React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import styles from './App.styles';

import { generateWallet, generateWalletFromSeed } from './generator';
import type { IWallet } from './wallet';

export default function App() {
  const [wallet, setWallet] = React.useState<IWallet>();

  const importWallet = async () => {
    setWallet(
      await generateWalletFromSeed(
        '153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc'
      )
    );
  };

  const generateNewWallet = async () => {
    setWallet(await generateWallet());
  };

  const refreshBalance = async () => {
    setWallet(await wallet!.refreshBalance()); //doesnt trigger rerender - see line 34
  };

  const transac = async () => {
    setWallet(await wallet!.refreshTransactions());
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Button onPress={importWallet} title="Import Wallet" />
        <Button onPress={generateNewWallet} title="Generate Wallet" />

        <Text>Address: {wallet?.config.address}</Text>

        <View style={styles.row}>
          <Text>Balance: {wallet?.balance.getValue()} BTC</Text>
          <Button onPress={refreshBalance} title="refresh" />
        </View>

        <Button onPress={transac} title="load transac" />
        {wallet?.transactions.map((t) => {
          return (
            <Text key={t.hash}> + {t.outputs[1].value / 100000000} BTC</Text>
          );
        })}
      </View>
    </ScrollView>
  );
}
