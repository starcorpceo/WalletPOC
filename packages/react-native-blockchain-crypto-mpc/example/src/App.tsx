import * as React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import styles from './App.styles'

import { generateWalletFromSeed, generateWallet } from './generator';
import type { IWallet } from './wallet';


export default function App() {

  const [wallet, setWallet] = React.useState<IWallet>();
  
  const importWallet = async () => {
    setWallet(await generateWalletFromSeed("153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc"))
  }

  const generateNewWallet = async () => {
    setWallet(await generateWallet())
  }

  const refreshBalance = async () => {
    await wallet!.refreshBalance() //doesnt trigger rerender - see line 34
  }

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
       
      </View>
    </ScrollView>
  );
}