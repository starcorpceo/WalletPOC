import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BitcoinAccountBuilder } from "bitcoin/controller/creation/bitcoin-account-creation";
import { getUsedAddresses } from "bitcoin/controller/creation/bitcoin-transaction-scanning";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useCallback, useEffect } from "react";
import { Button } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { AuthState, authState } from "state/atoms";
import { getPurposeWallet } from "state/utils";
import { useAddAddress } from "wallet/state/wallet-state-utils";
import Wallets from "wallet/view/generic-wallet-view";
import BitcoinWalletListView from "./list/bitcoin-wallet-list";
import { BitcoinBalance } from "./list/item/bitcoin-wallet-balance";
import { VirtualBalanceView } from "./virtual/virtual-balance";

type Props = NativeStackScreenProps<NavigationRoutes, "Bitcoin">;

const Bitcoin = ({ navigation }: Props) => {
  const bitcoinState = useRecoilValue<BitcoinWalletsState>(bitcoinWalletsState);
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin = useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);
  const setAddAddress = useAddAddress(bitcoinWalletsState);

  const purposeKeyShare = useRecoilValue(getPurposeWallet);

  useEffect(() => {
    const onOpen = async () => {
      if (bitcoinState.accounts.length > 0) return;

      const accountBuilder = new BitcoinAccountBuilder(user);

      const newState = await accountBuilder
        .init()
        .then((builder) => builder.useCoinTypeShare(purposeKeyShare, bitcoinState.coinTypeKeyShare))
        .then((builder) => builder.createAccount())
        .then((builder) => builder.createChange("internal"))
        .then((builder) => builder.createChange("external"))
        .then((builder) => builder.build());

      setBitcoin(() => newState);
    };

    onOpen();
  }, []);

  const deleteBitcoinAccount = useCallback(() => {
    setBitcoin((current) => ({ ...current, accounts: [] }));
  }, [setBitcoin]);

  const loadUsedAddresses = async () => {
    setAddAddress(
      await getUsedAddresses(user, bitcoinState.accounts[0], "external"),
      bitcoinState.accounts[0],
      "external"
    );
    setAddAddress(
      await getUsedAddresses(user, bitcoinState.accounts[0], "internal"),
      bitcoinState.accounts[0],
      "internal"
    );
  };

  return (
    <Wallets name="Bitcoin">
      {bitcoinState.accounts[0] && (
        <>
          <BitcoinBalance wallet={bitcoinState.accounts[0]}></BitcoinBalance>

          <Button
            onPress={() =>
              navigation.navigate("BitcoinTransactions", {
                account: bitcoinState.accounts[0].virtualAccount,
              })
            }
            title="Show transactions"
          />

          <BitcoinWalletListView
            wallets={bitcoinState.accounts}
            virtualAccount={bitcoinState.accounts[0]?.virtualAccount!}
          />
          <Button onPress={loadUsedAddresses} title="Load Used Addresses" />

          <Button onPress={deleteBitcoinAccount} title="Delete Bitcoin Account" />
        </>
      )}
    </Wallets>
  );
};

export default Bitcoin;
