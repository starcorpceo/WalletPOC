import { assignNewDepositAddress } from "bitcoin/controller/bitcoin-virtual-wallet";
import { mpcPublicKeyToBitcoinAddress } from "bitcoin/controller/bitcoinjs";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { getPublicKey } from "react-native-blockchain-crypto-mpc";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { deriveToMpcWallet } from "wallet/controller/generator";
import { VirtualAccount, VirtualAddress } from "wallet/virtual-wallet";
import { ChangeWallet } from "wallet/wallet";

type CreateBitcoinWalletProps = {
  external: ChangeWallet;
  virtualAccount: VirtualAccount | null;
};

const CreateBitcoinAdress = ({
  external,
  virtualAccount,
}: CreateBitcoinWalletProps) => {
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const startGenerate = useCallback(async () => {
    const addressMPC = await deriveToMpcWallet(
      external.mpcWallet,
      user,
      external.addresses.length.toString(),
      false
    );

    // Begin adding address to virtual account
    const addressPublicKey = await getPublicKey(addressMPC.keyShare);
    const addressAddress = await mpcPublicKeyToBitcoinAddress(addressPublicKey);
    if (!virtualAccount) return;
    const address: VirtualAddress = await assignNewDepositAddress(
      virtualAccount,
      addressAddress
    );
    // End adding address to virtual account

    console.log(
      "Address " +
        address.address +
        " created and assigned to virtual account " +
        virtualAccount.id
    );

    setBitcoin((current) => {
      return {
        ...current,
        accounts: [
          {
            ...current.accounts[0],
            external: {
              ...current.accounts[0].external,
              addresses: [
                ...current.accounts[0].external.addresses,
                {
                  mpcWallet: addressMPC,
                  publicKey: addressPublicKey,
                  address: addressAddress,
                },
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
