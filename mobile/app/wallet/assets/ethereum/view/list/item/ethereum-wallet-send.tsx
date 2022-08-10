import { User } from "api-types/user";
import { buildRawTransaction } from "ethereum/controller/ethereum-transaction.utils";
import { EthereumWallet } from "ethereum/types/ethereum";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import React, { useCallback, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import "shim";

type SendEthereumProps = {
  user: User;
  wallet: EthereumWallet;
  service: EthereumService;
};

const SendEthereum = ({ user, wallet, service }: SendEthereumProps) => {
  const [weis, setWeis] = useState<number>(500);
  const [toAddress, setToAddress] = useState<string>("0x49e749dc596ebb62b724262928d0657f8950a7d7");

  const sendTransaction = useCallback(async () => {
    try {
      const gasPrice = await service.getFees(EthereumProviderEnum.ALCHEMY);

      const address = wallet.external.addresses[0];
      const transactionCount = await service.getTransactionCount(address.address, EthereumProviderEnum.ALCHEMY);
      const transaction = await buildRawTransaction(
        address,
        user,
        toAddress,
        weis,
        Number.parseInt(transactionCount, 16),
        gasPrice
      );

      console.log("valid " + transaction.validate());

      const result = await service.sendRawTransaction(
        "0x" + transaction.serialize().toString("hex"),
        EthereumProviderEnum.ALCHEMY
      );
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }, [wallet, user, weis, toAddress]);

  return (
    <>
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <View>
          <TextInput placeholder="to" onChangeText={setToAddress} value={toAddress}></TextInput>
          <TextInput
            placeholder="0 Wei"
            onChangeText={(value) => setWeis(Number(value))}
            value={weis?.toString()}
          ></TextInput>
          <Text>Weis</Text>
        </View>
      </View>
      <Button onPress={sendTransaction} title="Send Transaction" />
    </>
  );
};

export default SendEthereum;
