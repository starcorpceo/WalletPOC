import { POSClient } from "@maticnetwork/maticjs";
import { checkDepositStatus } from "ethereum/polygon/controller/polygon-checkpoint-utils";
import { initialPolygonState, PendingTransaction, polygonState } from "ethereum/polygon/state/polygon-atoms";
import { styles } from "ethereum/polygon/view/ethereum-polygon-styles";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useRecoilState } from "recoil";
import PolygonPendingWithdrawItem from "./polygon-pending-withdraw-item-view";

type Props = {
  polygonClient: POSClient;
  address: string;
};

const PolygonPendingWithdrawList = ({ polygonClient, address }: Props) => {
  const [{ withdrawTransactions }, setWithdrawTransactions] = useRecoilState(polygonState);

  useEffect(() => {
    const observeWithdraws = checkDepositStatus(address, withdrawTransactions);

    observeWithdraws.subscribe({
      next: (withdraw: PendingTransaction) => {
        withdrawTransactions.map((trans) => (trans.hash === withdraw.hash ? withdraw : trans));
      },
      error: (error) => {
        console.warn(error, "Error while observing pending withdraws");
      },
    });
  }, []);

  if (!withdrawTransactions || withdrawTransactions.length === 0) return <></>;

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.heading}>Pending Withdraws from Polygonnn</Text>
        <Button onPress={() => setWithdrawTransactions((_) => initialPolygonState)} title="Reset Polygon state" />
      </View>
      {withdrawTransactions.map((transaction, index) => (
        <PolygonPendingWithdrawItem key={index} pendingTransaction={transaction} polygonClient={polygonClient} />
      ))}
    </View>
  );
};

export default PolygonPendingWithdrawList;
