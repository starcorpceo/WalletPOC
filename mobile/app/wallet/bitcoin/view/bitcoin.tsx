import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNewVirtualAccount } from "bitcoin/controller/bitcoin-virtual-wallet";
import {
  createBitcoinAccount,
  createChangeKeyShare,
} from "bitcoin/controller/create-addresses";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useEffect } from "react";
import { Button } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { getPurposeWallet } from "state/utils";
import Wallets from "wallet/generic-wallet-view";
import { NavigationRoutes } from "../../../shared/navigation";
import BitcoinWalletListView from "./list/bitcoin-wallet-list";
import { VirtualBalanceView } from "./virtual/virtual-balance";

type Props = NativeStackScreenProps<NavigationRoutes, "Bitcoin">;

const Bitcoin = ({ navigation }: Props) => {
  const bitcoinState = useRecoilValue<BitcoinWalletsState>(bitcoinWalletsState);
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const purposeKeyShare = useRecoilValue(getPurposeWallet);

  useEffect(() => {
    const onOpen = async () => {
      const result = await createBitcoinAccount(
        bitcoinState,
        user,
        purposeKeyShare
      );

      if (!result) return;

      const { bitcoinTypeKeyShare, account } = result;

      const virtualAccount = await createNewVirtualAccount();

      const internal = await createChangeKeyShare(
        user,
        account,
        virtualAccount,
        "1"
      );
      const external = await createChangeKeyShare(
        user,
        account,
        virtualAccount,
        "0"
      );

      setBitcoin((current: BitcoinWalletsState): BitcoinWalletsState => {
        return {
          ...current,
          coinTypeWallet: {
            ...current.coinTypeWallet,
            mpcKeyShare: bitcoinTypeKeyShare,
            virtualAccount: virtualAccount,
          },
          accounts: [
            ...current.accounts,
            {
              mpcKeyShare: account,
              transactions: [],
              internal,
              external,
            },
          ],
        };
      });
    };

    onOpen();
  }, []);

  return (
    <Wallets name="Bitcoin">
      <VirtualBalanceView wallet={bitcoinState.coinTypeWallet} />

      <Button
        onPress={() =>
          navigation.navigate("BitcoinTransactions", {
            account: bitcoinState.coinTypeWallet.virtualAccount,
          })
        }
        title="Show transactions"
      />

      <BitcoinWalletListView
        wallets={bitcoinState.accounts}
        virtualAccount={bitcoinState.coinTypeWallet.virtualAccount!}
      />
    </Wallets>
  );
};

export default Bitcoin;
