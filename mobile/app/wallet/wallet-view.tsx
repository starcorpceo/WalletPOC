import React from "react";
import { Text, View } from "react-native";

interface WalletProps {
  children: React.ReactNode;
}

const Wallet = ({ children }: WalletProps) => {
  return (
    <View>
      <Text>Hi this is my wallet</Text>
      {children}
    </View>
  );
};

export default Wallet;
