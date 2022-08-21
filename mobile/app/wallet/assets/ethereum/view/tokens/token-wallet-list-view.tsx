import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { ERC20Token, erc20Tokens, findContractAddressBySymbol } from "ethereum/config/token-constants";
import { EthereumWallet } from "ethereum/types/ethereum";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { Address } from "wallet/types/wallet";
type Props = NativeStackScreenProps<NavigationRoutes, "TokenWalletScreen">;

type TokenWalletListViewProps = {
  wallet: EthereumWallet;
  navigation: NativeStackNavigationProp<NavigationRoutes, "EthereumScreen", undefined>;
};

const TokenWalletListView = ({ wallet, navigation }: TokenWalletListViewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.heading}>Token Wallets</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("TokenUniswapScreen", { wallet })}
        >
          <Text style={styles.headerButtonText}>Swap Tokens</Text>
        </TouchableOpacity>
      </View>
      {erc20Tokens.map((token) => {
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("TokenWalletScreen", { wallet: wallet, token: token })}
          >
            <Text style={styles.actionButtonText}>
              {token.name} Wallet {"\u2192"}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 24,
    maxHeight: "80%",
    marginBottom: 30,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  actionButton: {
    height: 42,
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#3828e0",
  },
  actionButtonText: {
    color: "#3828e0",
    fontSize: 16,
  },
  headerButton: {},
  headerButtonText: {
    color: "blue",
  },
});

export default TokenWalletListView;
