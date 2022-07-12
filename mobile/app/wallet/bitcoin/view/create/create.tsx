import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { authState } from "state/atoms";
import GenerateBitcoinWallet from "./generate-bitcoin-wallet";
import ImportBitcoinWallet from "./import-bitcoin-wallet";

const CreateBitcoinWallet = () => {
  const user = useRecoilValue(authState);

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
      <ImportBitcoinWallet user={user} />
      <GenerateBitcoinWallet user={user} />
    </View>
  );
};

export default CreateBitcoinWallet;
