import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { gWeiToEth } from "ethereum/controller/ethereum-utils";
import { EthereumWallet } from "ethereum/types/Ethereum";
import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { Address } from "wallet/types/wallet";

//Currently only working with one address
type EthereumTransactionProps = {
  wallet: EthereumWallet;
  address: Address;
  navigation: NativeStackNavigationProp<NavigationRoutes, "EthereumScreen">;
  updateTransactions: () => Promise<void>;
};

const EthereumTransactionsView = ({ wallet, address, navigation, updateTransactions }: EthereumTransactionProps) => {
  const transactions = address.transactions as EthereumTransaction[];
  const [loading, setLoading] = useState<boolean>(false);

  const updateTransactionsFunction = async () => {
    setLoading(true);
    await updateTransactions();
    setTimeout(() => setLoading(false), 200);
  };

  return (
    <>
      <View style={styles.headingArea}>
        <Text style={styles.heading}>Unordered History</Text>
        <TouchableOpacity onPress={updateTransactionsFunction}>
          <Image
            style={styles.reloadIcon}
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/reload-retry-again-update-restart-refresh-sync-13-3149.png",
            }}
          />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator />}

      {wallet.mempool
        .slice(0)
        .reverse()
        .map((transaction, index) => {
          return (
            <View key={"mempool" + index} style={[styles.transaction, { backgroundColor: "#fcfcde" }]}>
              <Text>{transaction.to.slice(0, 16) + "..."}</Text>
              <View style={styles.pendingArea}>
                <Text style={{ color: "red" }}>-{gWeiToEth(transaction.value).toString().slice(0, 10)} ETH</Text>
                <Text style={styles.pendingText}>Pending...</Text>
              </View>
            </View>
          );
        })}

      {transactions.map((transaction) => {
        const isPlus = transaction.to === address.address;
        const colorBackground = !isPlus ? "#fcf2f2" : "#f3fcf2";

        const pre = isPlus ? "+" : "-";
        return (
          <TouchableOpacity
            key={transaction.hash}
            onPress={() => navigation.navigate("EthereumSingleTransactionScreen", { transaction, wallet })}
            style={[styles.transaction, { backgroundColor: colorBackground }]}
          >
            <Text>{transaction.to.slice(0, 16) + "..."}</Text>
            <Text key={transaction.hash} style={{ color: isPlus ? "green" : "red" }}>
              {pre + gWeiToEth(transaction.value).toString().slice(0, 10)} ETH
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  headingArea: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export default EthereumTransactionsView;
