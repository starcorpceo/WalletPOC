import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GenerateWallet from "../create/generate-wallet";
import ImportWallet from "../create/import-wallet";

const CreateBitcoinWallet = () => {
  return (
    <View
      style={{
        borderTopColor: "black",
        borderTopWidth: StyleSheet.hairlineWidth,
        marginTop: 24,
        paddingTop: 12,
      }}
    >
      <Text>You can always add more wallets:</Text>
      <ImportWallet />
      <GenerateWallet />
    </View>
  );
};

export default CreateBitcoinWallet;
