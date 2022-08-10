import { User } from "api-types/user";
import { buildRawTransaction } from "ethereum/controller/ethereum-transaction.utils";
import { gWeiToWei } from "ethereum/controller/ethereum-utils";
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
  const [gWeis, setGWeis] = useState<number>(500);
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
        gWeiToWei(gWeis),
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
  }, [wallet, user, gWeis, toAddress]);

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
            onChangeText={(value) => setGWeis(Number(value))}
            value={gWeis?.toString()}
          ></TextInput>
          <Text>GWeis</Text>
        </View>
      </View>
      <Button onPress={sendTransaction} title="Send Transaction" />
    </>
  );
};

export default SendEthereum;
