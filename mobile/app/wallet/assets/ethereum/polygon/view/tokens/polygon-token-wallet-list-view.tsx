import { POSClient } from "@maticnetwork/maticjs";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { erc20Tokens } from "ethereum/polygon/config/tokens";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
type Props = NativeStackScreenProps<NavigationRoutes, "TokenWalletScreen">;

type PolygonTokenWalletListViewProps = {
  polygonClient: POSClient;
  address: string;
  navigation: NativeStackNavigationProp<NavigationRoutes, "EthereumPolygonScreen", undefined>;
};

const PolygonTokenWalletListView = ({ polygonClient, address, navigation }: PolygonTokenWalletListViewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.heading}>Token Wallets</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("PolygonDepositScreen", { address, polygonClient })}
        >
          <Text style={styles.headerButtonText}>Deposit Tokens</Text>
        </TouchableOpacity>
      </View>
      {erc20Tokens.map((token) => {
        return (
          <TouchableOpacity
            style={styles.actionButton}
            key={token.name}
            onPress={() => navigation.navigate("PolygonTokenWalletScreen", { token, polygonClient, address })}
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

export default PolygonTokenWalletListView;
