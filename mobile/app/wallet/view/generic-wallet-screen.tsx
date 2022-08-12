import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface WalletProps {
  children: React.ReactNode;
  name: string;
}

const Wallets = ({ children, name }: WalletProps) => {
  return (
    <ScrollView
      scrollEnabled={true}
      style={{
        margin: 12,
        flex: 1,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>{name}</Text>
      {children}
    </ScrollView>
  );
};

export default Wallets;
