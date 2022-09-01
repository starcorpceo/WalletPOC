import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { styles as polygonStyles } from "ethereum/polygon/view/ethereum-polygon-styles";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";

type Props = NativeStackScreenProps<NavigationRoutes, "PolygonTokenSendScreen">;

const PolygonTokenSendScreen = ({ route }: Props) => {
  const { childErc20, token } = route.params;

  const [toAddress, setToAddress] = useState<string>("0x49e749dc596ebb62b724262928d0657f8950a7d7");
  const [tokenToSend, setTokenToSend] = useState<string>("");

  const broadcast = useCallback(
    async (amount: string, toAddress: string) => {
      try {
        const transfer = await childErc20.transfer(amount, toAddress);

        const receipt = await transfer.getReceipt();
        console.log("Transfer", receipt);
        Alert.alert("Successfully sent.");
      } catch (err) {
        console.log(err);
        Alert.alert("Unable to broadcast transaction");
      }
    },
    [childErc20]
  );

  const sendTransaction = useCallback(async () => {
    try {
      Alert.alert("Confirm your transaction", "Sending " + tokenToSend + " " + token.symbol + " to " + toAddress, [
        {
          text: "Send now",
          onPress: () => broadcast(tokenToSend, toAddress),
        },
        {
          text: "Cancel",
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  }, [broadcast, tokenToSend, token, toAddress]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Send {token.name}</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Receiver Address"
          onChangeText={setToAddress}
          value={toAddress}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder={"0 " + token.symbol}
          onChangeText={(value) => setTokenToSend(value)}
          value={tokenToSend?.toString()}
        ></TextInput>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={sendTransaction}>
        <Text style={styles.actionButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ...polygonStyles,
  input: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    marginTop: 14,
    borderRadius: 10,
    fontSize: 14,
  },
});

export default PolygonTokenSendScreen;
