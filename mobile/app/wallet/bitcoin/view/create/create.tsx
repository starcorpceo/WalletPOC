import { pubKeyTransformer } from "bitcoin/controller/bitcoinjs";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import constants from "config/constants";
import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import {
  deriveToMpcWallet,
  generateCryptoWallet,
} from "wallet/controller/generator";
import { Wallet } from "../../../../api-types/wallet";

type CreateBitcoinWalletProps = {
  state: BitcoinWalletsState;
};

const CreateBitcoinWallet = ({ state }: CreateBitcoinWalletProps) => {
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const startGenerate = useCallback(async () => {
    const bitcoinAccountWallet =
      state.coinTypeWallet ||
      (await deriveToMpcWallet(
        user.bip44PurposeWallet as Wallet,
        user,
        constants.bip44BitcoinCoinType,
        true
      ));

    const newIndex = state.accounts.length;

    const accountWallet = await generateCryptoWallet(
      bitcoinAccountWallet,
      user,
      newIndex.toString(),
      true,
      pubKeyTransformer
    );

    setBitcoin((current) => ({
      coinTypeWallet: bitcoinAccountWallet,
      accounts: [...current.accounts, accountWallet],
    }));
  }, [user, setBitcoin, state]);

  return (
    <View
      style={{
        borderTopColor: "black",
        borderTopWidth: StyleSheet.hairlineWidth,
        marginTop: 24,
        paddingTop: 12,
      }}
    >
      <Text>You can always add more Bitcoin wallets:</Text>
      <Button onPress={startGenerate} title="Create new Wallet Wallet" />
    </View>
  );
};

export default CreateBitcoinWallet;
