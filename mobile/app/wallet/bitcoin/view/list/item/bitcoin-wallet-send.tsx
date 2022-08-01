import { User } from "api-types/user";
import { BitcoinWallet } from "bitcoin/.";
import {
  prepareSigner,
  prepareTransaction,
  signTransaction,
} from "bitcoin/controller/bitcoin-wallet";
import * as bitcoin from "der-bitcoinjs-lib";
import React, { useCallback, useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import "shim";

type SendBitcoinProps = {
  user: User;
  wallet: BitcoinWallet;
};

const SendBitcoin = ({ user, wallet }: SendBitcoinProps) => {
  const [satoshis, setSatoshis] = useState<number>(500);
  const [toAddress, setToAddress] = useState<string>(
    "mySZuMKJxXLxDC5Hh1CuT876vqeqdXmqms"
  );

  const prepareTransac = useCallback(async () => {
    if (satoshis <= 0 || toAddress.length <= 0) {
      Alert.alert("Transaktionseingaben unvollständig!");
      return;
    }
    const preparedTransaction = prepareTransaction(
      wallet,
      user,
      toAddress,
      satoshis
    );
    const preparedSigner = prepareSigner(wallet, user);

    const finalizedTransaction = await signTransaction(
      preparedTransaction,
      preparedSigner
    );

    Alert.alert(
      "Send transaction",
      "Send " + satoshis + " to " + toAddress.slice(0, 6) + "...?",
      [
        {
          text: "Go",
          onPress: () => broadcast(finalizedTransaction),
        },
        {
          text: "Cancel",
        },
      ]
    );
  }, [wallet, user, satoshis, toAddress]);

  const broadcast = async (transaction: bitcoin.Psbt) => {
    //TODO move to fetchFromTatum
    const resp = await fetch(`https://api-eu1.tatum.io/v3/bitcoin/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "89156412-0b04-4ed1-aede-d4546b60697c",
      },
      body: JSON.stringify({
        txData: transaction.extractTransaction().toHex(),
      }),
    });
    Alert.alert("Sent transactions");
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        {/* <Button onPress={updateBalance} title="send" /> */}
        <View>
          <TextInput
            placeholder="to"
            onChangeText={setToAddress}
            value={toAddress}
          ></TextInput>
          <TextInput
            placeholder="0 sats"
            onChangeText={(value) => setSatoshis(Number(value))}
            value={satoshis?.toString()}
          ></TextInput>
        </View>
      </View>
      <Button onPress={prepareTransac} title="Prepare Transactions" />
    </>
  );
};

export default SendBitcoin;
