import { POSClient, setProofApi } from "@maticnetwork/maticjs";
import { PendingTransaction } from "ethereum/polygon/state/polygon-atoms";
import React, { useCallback } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../polygon-bridge-style";
type Props = {
  polygonClient: POSClient;
  pendingTransaction: PendingTransaction;
};

const PolygonPendingWithdrawItem = ({ polygonClient, pendingTransaction }: Props) => {
  const finishWithdraw = useCallback(async () => {
    setProofApi("https://apis.matic.network/");

    const parentErc20 = polygonClient.erc20(pendingTransaction.token.ethereumAddress, true);

    try {
      const withdrawEnd = await parentErc20.withdrawExitFaster(pendingTransaction.hash);
      const withdrawExitTransaction = await withdrawEnd.getTransactionHash();

      console.log("Withdraw ended", withdrawExitTransaction);

      Alert.alert("Withdraw finished successfully!");
    } catch (err) {
      console.error(err);
    }
  }, [pendingTransaction, polygonClient]);

  return (
    <View style={styles.container}>
      <Text>{pendingTransaction.hash.slice(0, 23) + "..."}</Text>
      <Text>
        {Number.parseInt(pendingTransaction.amount, 10) / 10 ** pendingTransaction.token.decimals +
          " " +
          pendingTransaction.token.symbol}
      </Text>
      <TouchableOpacity
        disabled={!pendingTransaction.checkpointed}
        style={pendingTransaction.checkpointed ? styles.actionButton : styles.actionButtonDisabled}
        onPress={finishWithdraw}
      >
        <Text style={styles.actionButtonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PolygonPendingWithdrawItem;
