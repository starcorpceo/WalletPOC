import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { authState } from "state/atoms";
import GenerateWallet from "../create/generate-wallet";
import ImportWallet from "../create/import-wallet";

const CreateAccountWallet = () => {
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
      <Text>You dont yet have an Account to hold Wallets</Text>
      <ImportWallet user={user} />
      <GenerateWallet user={user} />
    </View>
  );
};

export default CreateAccountWallet;
