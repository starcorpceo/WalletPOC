import { ERC20 } from "@maticnetwork/maticjs-plasma/dist/ts/erc20";
import { PendingTransaction } from "ethereum/polygon/state/polygon-atoms";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { styles } from "../polygon-bridge-style";

type Props = {
  pendingTransaction: PendingTransaction;
  contract: ERC20;
  deletePendingTransaction: Function;
};

const PolygonPendingPlasmaItemView = ({ pendingTransaction, contract, deletePendingTransaction }: Props) => {
  const [challanged, setChallanged] = useState(false);

  const startChallange = useCallback(async () => {
    const confirm = await contract.withdrawConfirmFaster(pendingTransaction.hash);
    await confirm.getTransactionHash();
    setChallanged(true);
  }, [contract, setChallanged]);

  const exitWithdraw = useCallback(async () => {
    const exit = await contract.withdrawExit();
    await exit.getTransactionHash();

    deletePendingTransaction(pendingTransaction);
  }, [pendingTransaction, contract]);

  const style = getButtonStyle(pendingTransaction.checkpointed, challanged);

  return (
    <TouchableOpacity
      disabled={!pendingTransaction.checkpointed}
      style={style}
      onPress={challanged ? exitWithdraw : startChallange}
    >
      <Text style={styles.actionButtonText}>{challanged ? "Withdraw" : "Start Challenge"}</Text>
    </TouchableOpacity>
  );
};

const getButtonStyle = (checkpointed: boolean, challenged: boolean) => {
  if (challenged) return buttonStyles.start;
  if (checkpointed) return styles.actionButton;
  return styles.actionButtonDisabled;
};

const buttonStyles = StyleSheet.create({
  start: {
    height: 42,
    width: "100%",
    backgroundColor: "#08d800",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
});

export default PolygonPendingPlasmaItemView;
