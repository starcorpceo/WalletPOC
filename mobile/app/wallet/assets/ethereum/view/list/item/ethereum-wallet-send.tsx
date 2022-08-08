import { User } from "api-types/user";
import { EthereumWallet } from "ethereum/types/ethereum";
import React, { useCallback, useState } from "react";
import { Button, TextInput, View } from "react-native";
import "shim";

type SendEthereumProps = {
  user: User;
  wallet: EthereumWallet;
};

const SendEthereum = ({ user, wallet }: SendEthereumProps) => {
  const [weis, setWeis] = useState<number>(500);
  const [toAddress, setToAddress] = useState<string>("mySZuMKJxXLxDC5Hh1CuT876vqeqdXmqms");

  const prepareTransac = useCallback(async () => {}, [wallet, user, weis, toAddress]);

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
          <TextInput placeholder="to" onChangeText={setToAddress} value={toAddress}></TextInput>
          <TextInput
            placeholder="0 Wei"
            onChangeText={(value) => setWeis(Number(value))}
            value={weis?.toString()}
          ></TextInput>
        </View>
      </View>
      <Button onPress={prepareTransac} title="Prepare Transactions" />
    </>
  );
};

export default SendEthereum;
