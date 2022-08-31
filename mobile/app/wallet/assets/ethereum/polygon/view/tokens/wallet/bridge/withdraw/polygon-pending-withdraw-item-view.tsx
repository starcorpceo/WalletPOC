import { POSClient, setProofApi } from "@maticnetwork/maticjs";
import { PendingTransaction, polygonState } from "ethereum/polygon/state/polygon-atoms";
import React, { useCallback, useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { styles } from "../polygon-bridge-style";
type Props = {
  polygonClient: POSClient;
  pendingTransaction: PendingTransaction;
};

const PolygonPendingWithdrawItem = ({ polygonClient, pendingTransaction }: Props) => {
  const setPolygonState = useSetRecoilState(polygonState);

  const check = useCallback(async () => {
    const checkpointed = await polygonClient.isCheckPointed(pendingTransaction.hash);

    const updatedTransaction = { ...pendingTransaction, checkpointed };

    setPolygonState((current) => ({
      ...current,
      withdrawTransactions: current.withdrawTransactions.map((trans) =>
        trans.hash === pendingTransaction.hash ? updatedTransaction : trans
      ),
    }));
  }, [polygonClient]);

  useEffect(() => {
    check();
  }, []);

  const finishWithdraw = useCallback(async () => {
    setProofApi("https://apis.matic.network/");

    const parentErc20 = polygonClient.erc20(pendingTransaction.token.ethereumAddress, true);

    try {
      const withdrawEnd = await parentErc20.withdrawExitFaster(pendingTransaction.hash);
      const withdrawExitTransaction = await withdrawEnd.getTransactionHash();

      console.log("Withdraw ended", withdrawExitTransaction);

      Alert.alert("Withdraw finished successfully!");

      setPolygonState((current) => ({
        ...current,
        withdrawTransactions: current.withdrawTransactions.filter((trans) => trans.hash !== pendingTransaction.hash),
      }));
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
