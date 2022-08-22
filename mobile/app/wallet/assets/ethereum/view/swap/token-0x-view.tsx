import { EthereumWallet } from "ethereum/types/ethereum";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Address } from "wallet/types/wallet";

type Props = {
  wallet: EthereumWallet;
  address: Address;
};

const Token0xView = ({ wallet, address }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>0x Swap</Text>
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
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Token0xView;
