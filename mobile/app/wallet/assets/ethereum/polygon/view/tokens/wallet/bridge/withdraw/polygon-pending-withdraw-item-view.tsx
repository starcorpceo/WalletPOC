import { POSClient, setProofApi } from "@maticnetwork/maticjs";
import { PlasmaClient } from "@maticnetwork/maticjs-plasma";
import { ERC20 as ERC20P } from "@maticnetwork/maticjs-plasma/dist/ts/erc20";
import { ERC20 } from "@maticnetwork/maticjs/dist/ts/pos/erc20";
import { PendingTransaction, polygonState } from "ethereum/polygon/state/polygon-atoms";
import React, { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { styles } from "../polygon-bridge-style";
import PolygonPendingPlasmaItemView from "./polygon-pending-plasma-item-view";
import PolygonPendingPosItemView from "./polygon-pending-pos-item-view";

type Props = {
  posClient: POSClient;
  plasmaClient: PlasmaClient;
  pendingTransaction: PendingTransaction;
};

const PolygonPendingWithdrawItem = ({ posClient, plasmaClient, pendingTransaction }: Props) => {
  const setPolygonState = useSetRecoilState(polygonState);
  const polygonClient = pendingTransaction.token.isToken ? posClient : plasmaClient;

  const check = useCallback(async () => {
    setProofApi("https://apis.matic.network/");

    const checkpointed = await polygonClient.isCheckPointed(pendingTransaction.hash);

    const updatedTransaction = { ...pendingTransaction, checkpointed };

    setPolygonState((current) => ({
      ...current,
      withdrawTransactions: current.withdrawTransactions.map((trans) =>
        trans.hash === pendingTransaction.hash ? updatedTransaction : trans
      ),
    }));
  }, [posClient, plasmaClient, setPolygonState]);

  useEffect(() => {
    check();
  }, []);

  const deletePendingTransaction = useCallback(
    (pendingTransaction: PendingTransaction) => {
      setPolygonState((current) => ({
        ...current,
        withdrawTransactions: current.withdrawTransactions.filter((trans) => trans.hash !== pendingTransaction.hash),
      }));
    },
    [setPolygonState]
  );

  const contract = pendingTransaction.token.isToken
    ? posClient.erc20(pendingTransaction.token.ethereumAddress, true)
    : plasmaClient.erc20(pendingTransaction.token.ethereumAddress, true);

  return (
    <View style={styles.container}>
      <Text>{pendingTransaction.hash.slice(0, 23) + "..."}</Text>
      <Text>
        {Number.parseInt(pendingTransaction.amount, 10) / 10 ** pendingTransaction.token.decimals +
          " " +
          pendingTransaction.token.symbol}
      </Text>
      {pendingTransaction.token.isToken ? (
        <PolygonPendingPosItemView
          contract={contract as ERC20}
          pendingTransaction={pendingTransaction}
          deletePendingTransaction={deletePendingTransaction}
        />
      ) : (
        <PolygonPendingPlasmaItemView
          contract={contract as ERC20P}
          pendingTransaction={pendingTransaction}
          deletePendingTransaction={deletePendingTransaction}
        />
      )}
    </View>
  );
};

export default PolygonPendingWithdrawItem;
