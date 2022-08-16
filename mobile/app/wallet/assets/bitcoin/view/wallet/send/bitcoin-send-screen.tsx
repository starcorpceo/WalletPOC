import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signAllInputs } from "bitcoin/controller/bitcoin-signer";
import { broadcastTransaction, prepareTransactionP2PKH } from "bitcoin/controller/bitcoin-transaction";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { bitcoinWalletsState } from "bitcoin/state/bitcoin-atoms";
import { useAddMempoolTransaction } from "bitcoin/state/bitcoin-wallet-state-utils";
import { Psbt } from "der-bitcoinjs-lib";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { authState, AuthState } from "state/atoms";

type Props = NativeStackScreenProps<NavigationRoutes, "BitcoinSendScreen">;

const BitcoinSendScreen = ({ route }: Props) => {
  const user = useRecoilValue<AuthState>(authState);
  const addMempoolTransaction = useAddMempoolTransaction(bitcoinWalletsState);

  const [receiverAddress, setReceiverAddress] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const newTransaction = async () => {
    const { account } = route.params;
    if (!receiverAddress || !amount || Number(amount) <= 0) return;

    try {
      const { preparedTransactions, preparedSigners } = await prepareTransactionP2PKH(
        user,
        account,
        receiverAddress,
        Number(amount)
      );

      const finalizedTransaction = await signAllInputs(preparedTransactions, preparedSigners);

      Alert.alert(
        "Confirm your transaction",
        "Sending " + amount + " Satoshis (" + SatoshisToBitcoin(Number(amount)) + " BTC) to " + receiverAddress,
        [
          {
            text: "Send now",
            onPress: () => broadcast(finalizedTransaction),
          },
          {
            text: "Cancel",
          },
        ]
      );
    } catch (err) {
      Alert.alert("You aint got enough money");
    }
  };

  const broadcast = async (finalizedTransaction: Psbt) => {
    const { account } = route.params;
    try {
      const { txId } = await broadcastTransaction(finalizedTransaction);
      Alert.alert("Successfully sent.");
      addMempoolTransaction(finalizedTransaction, account);
    } catch (err) {
      console.log(err);
      Alert.alert("Unable to broadcast transaction");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Send Bitcoin</Text>
      <TextInput
        style={styles.input}
        onChangeText={setReceiverAddress}
        value={receiverAddress}
        placeholder="Receiver Address"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setAmount(value)}
        value={amount}
        placeholder="0 Satoshis"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.actionButton} onPress={newTransaction}>
        <Text style={styles.actionButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    margin: 12,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    marginTop: 14,
    borderRadius: 10,
    fontSize: 14,
  },
  actionButton: {
    height: 42,
    width: "100%",
    backgroundColor: "#3828e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default BitcoinSendScreen;
