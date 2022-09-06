import { ERC20 } from "@maticnetwork/maticjs/dist/ts/pos/erc20";
import { PendingTransaction } from "ethereum/polygon/state/polygon-atoms";
import React, { useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../polygon-bridge-style";

type Props = {
  pendingTransaction: PendingTransaction;
  contract: ERC20;
  deletePendingTransaction: Function;
};

const PolygonPendingPosItemView = ({ pendingTransaction, contract, deletePendingTransaction }: Props) => {
  const exitWithdraw = useCallback(async () => {
    const exit = await contract.withdrawExit(pendingTransaction.hash);
    await exit.getTransactionHash();

    deletePendingTransaction(pendingTransaction);
  }, [pendingTransaction, contract]);

  const style = pendingTransaction.checkpointed ? styles.actionButton : styles.actionButtonDisabled;

  return (
    <TouchableOpacity disabled={!pendingTransaction.checkpointed} style={style} onPress={exitWithdraw}>
      <Text style={styles.actionButtonText}>Withdraw</Text>
    </TouchableOpacity>
  );
};

export default PolygonPendingPosItemView;
