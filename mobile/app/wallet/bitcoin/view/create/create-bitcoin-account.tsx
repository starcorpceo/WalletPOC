import { mpcWalletToBitcoinWallet } from "bitcoin/controller/bitcoinjs";
import {
  BitcoinWalletsState,
  bitcoinWalletsState,
  initialBitcoinState,
} from "bitcoin/state/atoms";
import constants from "config/constants";
import { deepCompare } from "lib/string";
import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { deriveToMpcWallet } from "wallet/controller/generator";
import { User } from "../../../../api-types/user";
import { MPCWallet } from "../../../../api-types/wallet";

type CreateBitcoinWalletProps = {
  state: BitcoinWalletsState;
};

const CreateBitcoinWallet = ({ state }: CreateBitcoinWalletProps) => {
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const startGenerate = useCallback(async () => {
    const bitcoinAccountWallet = await getBitcoinTypeWallet(state, user);

    const newIndex = state.accounts.length;

    const accountMpcWallet = await deriveToMpcWallet(
      bitcoinAccountWallet,
      user,
      newIndex.toString(),
      true
    );

    const bitcoinWallet = await mpcWalletToBitcoinWallet(accountMpcWallet);

    setBitcoin((current) => ({
      coinTypeWallet: bitcoinAccountWallet,
      accounts: [...current.accounts, bitcoinWallet],
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

const getBitcoinTypeWallet = async (
  state: BitcoinWalletsState,
  user: User
): Promise<MPCWallet> => {
  if (deepCompare(state.coinTypeWallet, initialBitcoinState.coinTypeWallet))
    return await deriveToMpcWallet(
      user.bip44PurposeWallet as MPCWallet,
      user,
      constants.bip44BitcoinCoinType,
      true
    );

  return state.coinTypeWallet;
};

export default CreateBitcoinWallet;
