import { mpcPublicKeyToBitcoinAddress } from "bitcoin/controller/bitcoinjs-adapter";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { KeyShareType } from "shared/types/mpc";
import { AuthState, authState } from "state/atoms";
import { createAddress } from "wallet/controller/creation/account-creation";
import { deriveMpcKeyShare } from "wallet/controller/creation/derived-share-creation";
import { VirtualAccount } from "wallet/types/virtual-wallet";
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
    const newAddressShare = await deriveMpcKeyShare(
      external.keyShare,
      user,
      external.addresses.length.toString(),
      false,
      KeyShareType.ADDRESS
    );

    const newAddress = await createAddress(
      newAddressShare,
      virtualAccount,
      mpcPublicKeyToBitcoinAddress
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
