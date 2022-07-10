import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface WalletProps {
  children: React.ReactNode;
  name: string;
}

const Wallets = ({ children, name }: WalletProps) => {
  return (
    <View
      style={{
        borderColor: "black",
        borderWidth: StyleSheet.hairlineWidth,
        margin: 4,
        padding: 12,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 12 }}>
        {name}
      </Text>
      {children}
    </View>
  );
};

export default Wallets;
