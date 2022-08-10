import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getTransactions } from "bitcoin/controller/virtual/bitcoin-virtual-wallet";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { VirtualAccount, VirtualTransaction } from "wallet/types/virtual-wallet";
import { NavigationRoutes } from "shared/types/navigation";
import { Address, Transaction } from "wallet/types/wallet";
import { getNextUnusedAddress } from "bitcoin/controller/bitcoin-address";
import { useRecoilValue } from "recoil";
import { authState, AuthState } from "state/atoms";
import { prepareTransactionP2PKH } from "bitcoin/controller/bitcoin-transaction";
import { signAllInputs } from "bitcoin/controller/bitcoin-signer";

type Props = NativeStackScreenProps<NavigationRoutes, "SendTransaction">;

const SendTransactionView = ({ route }: Props) => {
  const user = useRecoilValue<AuthState>(authState);

  const [receiverAddres, setReceiverAddres] = useState<string>("mkWwpKSPyQX7jW9jmLX3uuAtwH6etRz9cZ");
  const [amount, setAmount] = useState<number>(15000);

  const prepareNewTransaction = async () => {
    const { account } = route.params;
    try {
      const { preparedTransactions, preparedSigners } = await prepareTransactionP2PKH(
        user,
        account,
        receiverAddres,
        amount
      );
    } catch (err) {
      Alert.alert("You aint got enough money");
    }
    //const finalizedTransaction = await signAllInputs(preparedTransactions, preparedSigners);
  };

  return (
    <>
      <Text>Create new Transaction</Text>
      <TextInput
        style={styles.input}
        onChangeText={setReceiverAddres}
        value={receiverAddres}
        placeholder="Receiver Address"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setAmount(Number(value))}
        value={amount?.toString()}
        placeholder="0 Satoshis"
        keyboardType="numeric"
      />
      <Button onPress={prepareNewTransaction} title="Send" />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default SendTransactionView;
