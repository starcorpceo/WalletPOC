import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ERC20Token } from "ethereum/config/token-constants";
import { EthereumWallet } from "ethereum/types/ethereum";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { Address } from "wallet/types/wallet";
import { TokenBalanceView } from "./balance/token-balance-view";
import TokenTransactionsView from "./transaction/token-transactions-view";

type Props = NativeStackScreenProps<NavigationRoutes, "TokenWalletScreen">;

const TokenWalletScreen = ({ route, navigation }: Props) => {
  const [token, setToken] = useState<ERC20Token>(route.params.token);
  const [wallet, setWallet] = useState<EthereumWallet>(route.params.wallet);
  const [address, setAddress] = useState<Address>(route.params.wallet.external.addresses[0]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headingArea}>
        <Text style={styles.heading}>{token.name} Wallet</Text>
      </View>

      <TokenBalanceView address={address} token={token} />

      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("TokenSendScreen", { wallet, token })}
        >
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <TokenTransactionsView wallet={wallet} address={address} navigation={navigation} token={token} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    margin: 12,
    maxHeight: "80%",
  },
  headingArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 22,
    marginBottom: 22,
  },
  actionButton: {
    flex: 1,
    height: 42,
    backgroundColor: "#3828e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
  actionAreaSpace: {
    width: 18,
  },
});

export default TokenWalletScreen;
