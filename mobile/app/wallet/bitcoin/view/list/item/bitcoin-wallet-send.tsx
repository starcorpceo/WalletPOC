import { BitcoinWallet } from "bitcoin/.";
import {
  prepareSigner,
  prepareTransaction,
  signTransaction,
} from "bitcoin/controller/bitcoin-wallet";
import React, { useCallback } from "react";
import { Button, TextInput, View } from "react-native";
import { User } from "../../../../../api-types/user";

type SendBitcoinProps = {
  user: User;
  wallet: BitcoinWallet;
};

const SendBitcoin = ({ user, wallet }: SendBitcoinProps) => {
  const prepareTransac = useCallback(async () => {
    const preparedTransaction = prepareTransaction(
      wallet,
      user,
      "mySZuMKJxXLxDC5Hh1CuT876vqeqdXmqms",
      110000
    );
    const preparedSigner = prepareSigner(wallet, user);

    const finalizedTransaction = await signTransaction(
      preparedTransaction,
      preparedSigner
    );

    console.log("Extracted", finalizedTransaction.extractTransaction());
  }, [wallet, user]);

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
          <TextInput placeholder="to"></TextInput>
          <TextInput placeholder="0 sats"></TextInput>
        </View>
      </View>
      <Button onPress={prepareTransac} title="Prepare Transactions" />
    </>
  );
};

export default SendBitcoin;
