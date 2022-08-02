import { createAddressShare } from "bitcoin/controller/create-addresses";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { VirtualAccount, VirtualAddress } from "wallet/types/virtual-wallet";
import { AccountChange } from "wallet/types/wallet";

type CreateBitcoinWalletProps = {
  external: AccountChange;
  index: number;
  virtualAccount: VirtualAccount;
};

const CreateBitcoinAdress = ({
  external,
  index,
  virtualAccount,
}: CreateBitcoinWalletProps) => {
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const startGenerate = useCallback(async () => {
    const newAddress = await createAddressShare(
      external.keyShare,
      user,
      virtualAccount,
      external.addresses.length.toString()
    );

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
