import { mpcPublicKeyToBitcoinAddress } from "bitcoin/controller/bitcoinjs";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import { deriveNonHardenedShare } from "lib/mpc/deriveBip32";
import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { getPublicKey } from "react-native-blockchain-crypto-mpc";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { ChangeWallet } from "wallet/wallet";

type CreateBitcoinWalletProps = {
  external: ChangeWallet;
};

const CreateBitcoinAdress = ({ external }: CreateBitcoinWalletProps) => {
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const startGenerate = useCallback(async () => {
    const accountShare = await deriveNonHardenedShare(
      external.share,
      external.addresses.length
    );

    const accountPublicKey = await getPublicKey(accountShare);

    const accountAddress = await mpcPublicKeyToBitcoinAddress(accountPublicKey);

    // const success = await initSignEcdsa(
    //   new Uint8Array(Buffer.from("hi")),
    //   external.share
    // );

    // console.log("succ", success);

    // step(null).then((somth) => {
    //   step(somth.message).then((step2) => {
    //     console.log("step2", somth);
    //   });
    // });

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
                  share: accountShare,
                  publicKey: accountPublicKey,
                  address: accountAddress,
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
