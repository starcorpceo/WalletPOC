import { POSClient } from "@maticnetwork/maticjs";
import React, { useCallback, useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { styles } from "./ethereum-polygon-styles";

type Props = {
  polygonClient: POSClient;
};

const PolygonCheckTransaction = ({ polygonClient }: Props) => {
  const [txHash, setTxHash] = useState("");

  const check = useCallback(async () => {
    const checked = await polygonClient.isCheckPointed(txHash);

    Alert.alert("Transaction has been checkpointed: " + checked);
  }, [polygonClient, txHash]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Transaction Hash"
        onChangeText={setTxHash}
        value={txHash}
      ></TextInput>
      <Button onPress={check} title="Check Transaction" />
    </View>
  );
};

export default PolygonCheckTransaction;
