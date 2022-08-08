import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { CreateAddress } from "wallet/controller/creation/address-creation";

type CreateBitcoinWalletProps = {
  wallet: BitcoinWallet;
};

const CreateBitcoinAdress = ({ wallet }: CreateBitcoinWalletProps) => {
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin = useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const startGenerate = () => {
    CreateAddress({ user, account: wallet, changeType: "external", setCoin: setBitcoin });
  };

  return (
    <View
      style={{
        borderTopColor: "black",
        borderTopWidth: StyleSheet.hairlineWidth,
        marginTop: 24,
        paddingTop: 12,
      }}
    >
      <Text>You can always create more Bitcoin addresses:</Text>
      <Button onPress={startGenerate} title="Create new Wallet" />
    </View>
  );
};

export default CreateBitcoinAdress;
