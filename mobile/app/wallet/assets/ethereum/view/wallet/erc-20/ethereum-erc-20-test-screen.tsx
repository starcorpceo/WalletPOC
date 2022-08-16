import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import {
  EthereumTokenBalance,
  EthereumTokenBalances,
  EthereumTransaction,
} from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { abiArray } from "./abi-array";

type Props = NativeStackScreenProps<NavigationRoutes, "EthereumERC20TestScreen">;

const EthereumERC20TestScreen = ({ route }: Props) => {
  const [tokenBalanceUSDC, setTokenBalanceUSDC] = useState<EthereumTokenBalance>();
  const [transactions, setTransactions] = useState<EthereumTransaction[]>();
  const wallet = route.params.wallet;
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);

  const [service] = useState(new EthereumService("TEST"));

  useEffect(() => {
    updateBalance();
  }, []);

  const updateBalance = () => {
    const loadBalance = async () => {
      setLoadingBalance(true);
      let tokenAddr: string[] = [];
      tokenAddr.push("0x07865c6e87b9f70255377e024ace6630c1eaa37f"); //should be usdc
      const tokenBalances: EthereumTokenBalances = await service.getTokenBalances(
        wallet.external.addresses[0].address,
        tokenAddr,
        EthereumProviderEnum.ALCHEMY
      );
      setTokenBalanceUSDC(tokenBalances.tokenBalances[0]);
      setLoadingBalance(false);
    };
    loadBalance();
  };

  const updateTransactions = async () => {
    setLoadingTransactions(true);
    const transactions: EthereumTransaction[] = await service.getERC20Transactions(
      wallet.external.addresses[0].address,
      EthereumProviderEnum.ALCHEMY
    );
    console.log(transactions);
    setTransactions(transactions);
    setLoadingTransactions(false);
  };

  const send = () => {
    const abi = abiArray;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingAreaTop}>
        <Image style={styles.icon} source={{ uri: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" }} />
        <Text style={styles.heading}>USDC Wallet</Text>
      </View>
      <View style={styles.balanceContainer}>
        <View style={{ flexDirection: "row" }}>
          {tokenBalanceUSDC && (
            <Text style={styles.balanceText}>{Number.parseInt(tokenBalanceUSDC?.tokenBalance, 16) / 10 ** 6} USDC</Text>
          )}
          {!tokenBalanceUSDC && <Text style={styles.balanceText}>0 USDC</Text>}
          {loadingBalance && <ActivityIndicator />}
        </View>
        <TouchableOpacity onPress={updateBalance}>
          <Image
            style={styles.reloadIcon}
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/reload-retry-again-update-restart-refresh-sync-13-3149.png",
            }}
          />
        </TouchableOpacity>
      </View>

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

      {loadingTransactions && <ActivityIndicator />}

      {transactions &&
        transactions.map((transaction) => {
          const isPlus = transaction.to === wallet.external.addresses[0].address;
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
                {pre +
                  Number.parseInt(transaction.rawContract.value, 16) /
                    10 ** Number.parseInt(transaction.rawContract.decimal, 16)}{" "}
                USDC
              </Text>
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    margin: 12,
    paddingBottom: 24,
  },
  headingAreaTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  headingArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "lightgrey",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: "normal",
    marginRight: 8,
  },
  reloadIcon: {
    width: 20,
    height: 20,
  },
  icon: { width: 25, height: 25, marginRight: 6 },
});

export default EthereumERC20TestScreen;
