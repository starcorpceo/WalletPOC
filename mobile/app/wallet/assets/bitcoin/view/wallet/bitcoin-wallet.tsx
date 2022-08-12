import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React from "react";
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { BitcoinBalanceView } from "./balance/bitcoin-balance-view";
import BitcoinTransactionsView from "./transaction/bitcoin-transactions-view";

type BitcoinWalletProps = {
  wallet: BitcoinWallet;
  index: number;
  navigation: NativeStackNavigationProp<NavigationRoutes, "BitcoinScreen", undefined>;
};

const BitcoinWalletView = ({ wallet, index, navigation }: BitcoinWalletProps) => {
  return (
    <View key={"wallet-" + index} style={styles.container}>
      <View style={styles.headingArea}>
        <Image style={styles.icon} source={{ uri: "https://bitcoin.org/img/icons/opengraph.png?1657703267" }} />
        <Text style={styles.heading}>Bitcoin Wallet</Text>
      </View>

      <BitcoinBalanceView wallet={wallet} />

      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("BitcoinReceiveScreen", { account: wallet })}
        >
          <Text style={styles.actionButtonText}>Receive</Text>
        </TouchableOpacity>
        <View style={styles.actionAreaSpace} />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("BitcoinSendScreen", { account: wallet })}
        >
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <BitcoinTransactionsView wallet={wallet} navigation={navigation} />

      {/* <Text>Addresses</Text>

      <View>
        {wallet.external.addresses.map((addr) => (
          <>
            <Text key={addr.publicKey.toString()}>{addr.address}</Text>
            <Text>Transactions count: {addr.transactions.length}</Text>
          </>
        ))}
      </View> */}
    </View>
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
  icon: { width: 25, height: 25, marginRight: 6 },
  actionArea: { flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop: 22, marginBottom: 22 },
  actionAreaSpace: {
    width: 18,
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
});

export default BitcoinWalletView;
