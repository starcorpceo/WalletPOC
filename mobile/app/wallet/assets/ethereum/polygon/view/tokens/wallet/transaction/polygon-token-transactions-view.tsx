import { PolygonERC20Token } from "ethereum/polygon/config/tokens";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TokenTransactionProps = {
  address: string;
  token: PolygonERC20Token;
};

const TokenTransactionsView = ({ address, token }: TokenTransactionProps) => {
  const [transactions, setTransactions] = useState<EthereumTransaction[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    updateTransactions();
  }, []);

  const [service] = useState(new EthereumService("TEST", "Polygon"));
  const updateTransactions = useCallback(async () => {
    setLoading(true);
    const transactions: EthereumTransaction[] = await service.getERC20Transactions(
      address,
      EthereumProviderEnum.ALCHEMY
    );
    setTransactions(
      transactions.filter(
        (transaction) => transaction.rawContract.address.toLowerCase() == token.polygonAddress.toLowerCase()
      )
    );
    setLoading(false);
  }, [setLoading, service, setTransactions, token, address]);

  return (
    <>
      <View style={styles.headingArea}>
        <Text style={styles.heading}>Unordered History</Text>
        <TouchableOpacity onPress={updateTransactions}>
          <Image
            style={styles.reloadIcon}
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/reload-retry-again-update-restart-refresh-sync-13-3149.png",
            }}
          />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator />}

      {transactions &&
        transactions.map((transaction) => {
          const isPlus = transaction.to === address;
          const colorBackground = !isPlus ? "#fcf2f2" : "#f3fcf2";

          const pre = isPlus ? "+" : "-";
          return (
            <View key={transaction.hash} style={[styles.transaction, { backgroundColor: colorBackground }]}>
              {isPlus ? (
                <Text>{transaction.from.slice(0, 16) + "..."}</Text>
              ) : (
                <Text>{transaction.to.slice(0, 16) + "..."}</Text>
              )}
              <Text key={transaction.hash} style={{ color: isPlus ? "green" : "red" }}>
                {pre + Number.parseInt(transaction.rawContract.value, 16) / 10 ** token.decimals} {token.symbol}
              </Text>
            </View>
          );
        })}
    </>
  );
};

const styles = StyleSheet.create({
  headingArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
  },
  transaction: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "lightgrey",
  },
  reloadIcon: {
    width: 16,
    height: 16,
  },
  pendingText: {
    color: "grey",
  },
  pendingArea: {
    alignItems: "flex-end",
  },
});

export default TokenTransactionsView;
