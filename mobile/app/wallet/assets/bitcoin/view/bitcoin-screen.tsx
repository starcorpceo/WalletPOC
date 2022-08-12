import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BitcoinAccountBuilder } from "bitcoin/controller/creation/bitcoin-account-creation";
import { getUsedAddresses } from "bitcoin/controller/creation/bitcoin-transaction-scanning";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/bitcoin-atoms";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { getPurposeWallet } from "state/utils";
import { useAddAddress } from "wallet/state/wallet-state-utils";
import Wallets from "wallet/view/generic-wallet-screen";
import BitcoinWalletView from "./wallet/bitcoin-wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "BitcoinScreen">;

const BitcoinScreen = ({ navigation, route }: Props) => {
  const [bitcoinState, setBitcoin] = useRecoilState<BitcoinWalletsState>(bitcoinWalletsState);
  const setAddAddress = useAddAddress(bitcoinWalletsState);
  const purposeKeyShare = useRecoilValue(getPurposeWallet);

  const { isStateEmpty, user } = route.params;

  useEffect(() => {
    const onOpen = async () => {
      if (bitcoinState.accounts.length > 0 || !isStateEmpty) return;

      const accountBuilder = new BitcoinAccountBuilder(user);

      const newState = await accountBuilder
        .init()
        .then((builder) => builder.useCoinTypeShare(purposeKeyShare, bitcoinState.coinTypeKeyShare))
        .then((builder) => builder.createAccount(false))
        .then((builder) => builder.createChange("internal"))
        .then((builder) => builder.createChange("external"))
        .then((builder) => builder.build());

      setBitcoin(() => newState as BitcoinWalletsState);
      await loadUsedAddresses(newState);
      //TODO also load balances here
    };

    onOpen();
  }, []);

  const deleteBitcoinAccount = useCallback(() => {
    setBitcoin((current) => ({ ...current, accounts: [] }));
  }, [setBitcoin]);

  const loadUsedAddresses = async (state: any) => {
    setAddAddress(await getUsedAddresses(user, state.accounts[0], "external"), state.accounts[0], "external");
    setAddAddress(await getUsedAddresses(user, state.accounts[0], "internal"), state.accounts[0], "internal");
  };

  return (
    <Wallets name="Bitcoin">
      {bitcoinState.accounts[0] && (
        <>
          {bitcoinState.accounts.map((wallet, index: number) => (
            <>
              <BitcoinWalletView key={"Wallet-" + index} wallet={wallet} index={index} navigation={navigation} />
            </>
          ))}

          <TouchableOpacity style={styles.deleteButton} onPress={deleteBitcoinAccount}>
            <Text style={styles.deleteButtonText}>Delete Bitcoin Accounts</Text>
          </TouchableOpacity>
        </>
      )}
    </Wallets>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    marginTop: 12,
  },
  deleteButtonText: {
    fontSize: 17,
    color: "red",
  },
});

export default BitcoinScreen;
