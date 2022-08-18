import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ERC20Token } from "ethereum/config/token-constants";
import { gWeiToEth } from "ethereum/controller/ethereum-utils";
import { EthereumWallet } from "ethereum/types/Ethereum";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { Address } from "wallet/types/wallet";

//Currently only working with one address
type TokenTransactionProps = {
  wallet: EthereumWallet;
  address: Address;
  token: ERC20Token;
  navigation: NativeStackNavigationProp<NavigationRoutes, "TokenWalletScreen">;
};

const TokenTransactionsView = ({ wallet, address, token, navigation }: TokenTransactionProps) => {
  const [transactions, setTransactions] = useState<EthereumTransaction[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    updateTransactions();
  }, []);

  const [service] = useState(new EthereumService("TEST"));
  const updateTransactions = async () => {
    setLoading(true);
    const transactions: EthereumTransaction[] = await service.getERC20Transactions(
      address.address,
      EthereumProviderEnum.ALCHEMY
    );
    setTransactions(
      transactions.filter(
        (transaction) => transaction.rawContract.address.toLowerCase() == token.contractAddress.toLowerCase()
      )
    );
    setLoading(false);
  };

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
