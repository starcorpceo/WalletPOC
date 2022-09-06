import { POSClient } from "@maticnetwork/maticjs";
import { PlasmaClient } from "@maticnetwork/maticjs-plasma";
import { initialPolygonState, polygonState } from "ethereum/polygon/state/polygon-atoms";
import { styles } from "ethereum/polygon/view/ethereum-polygon-styles";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useRecoilState } from "recoil";
import PolygonPendingWithdrawItem from "./polygon-pending-withdraw-item-view";

type Props = {
  posClient: POSClient;
  plasmaClient: PlasmaClient;
  address: string;
};

const PolygonPendingWithdrawList = ({ plasmaClient, posClient, address }: Props) => {
  const [{ withdrawTransactions }, setWithdrawTransactions] = useRecoilState(polygonState);

  useEffect(() => {
    // let observeWithdraws = checkDepositStatus(address, withdrawTransactions);
    // observeWithdraws.subscribe({
    //   next: (withdraw: PendingTransaction) => {
    //     setWithdrawTransactions((current) => ({
    //       ...current,
    //       withdrawTransactions: withdrawTransactions.map((trans) => (trans.hash === withdraw.hash ? withdraw : trans)),
    //     }));
    //   },
    //   error: (error: any) => {
    //     console.warn(error, "Error while observing pending withdraws");
    //   },
    // });
  }, [withdrawTransactions]);

  if (!withdrawTransactions || withdrawTransactions.length === 0) return <></>;

  return (
    <View style={styles.container}>
      <Button onPress={() => setWithdrawTransactions((_) => initialPolygonState)} title="Reset Polygon state" />

      <View style={styles.headerArea}>
        <Text style={styles.heading}>Pending Withdraws from Polygon</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        {withdrawTransactions.map((transaction, index) => (
          <PolygonPendingWithdrawItem
            key={index}
            pendingTransaction={transaction}
            plasmaClient={plasmaClient}
            posClient={posClient}
          />
        ))}
      </View>
    </View>
  );
};

export default PolygonPendingWithdrawList;
