import { createAddressShare } from "bitcoin/controller/create-addresses";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { WalletChange } from "wallet/wallet";

type CreateBitcoinWalletProps = {
  external: WalletChange;
  index: number;
};

const CreateBitcoinAdress = ({ external, index }: CreateBitcoinWalletProps) => {
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const startGenerate = useCallback(async () => {
    const newAddress = await createAddressShare(
      external.keyShare,
      user,
      external.addresses.length.toString()
    );

    console.log({ external, index });

    setBitcoin((current) => {
      return {
        ...current,
        accounts: [
          {
            ...current.accounts[index],
            external: {
              ...current.accounts[index].external,
              addresses: [
                ...current.accounts[index].external.addresses,
                newAddress,
              ],
            },
          },
        ],
      };
    });
  }, [user, setBitcoin, external]);

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
