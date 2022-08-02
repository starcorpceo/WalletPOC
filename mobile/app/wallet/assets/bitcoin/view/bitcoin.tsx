import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  CreateTatumConnectionResponse,
  GetTatumConnectionResponse,
} from "api-types/tatum";
import { config } from "bitcoin/config/bitcoin-config";
import { defaultBitcoinAccountConfig } from "bitcoin/config/bitcoin-constants";
import { connectVirtualAccount } from "bitcoin/controller/bitcoin-virtual-wallet";
import { mpcPublicKeyToBitcoinAddress } from "bitcoin/controller/bitcoinjs-adapter";
import {
  createBitcoinAccount,
  createChangeKeyShare,
} from "bitcoin/controller/create-addresses";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import { fetchFromApi, HttpMethod } from "lib/http";
import React, { useEffect } from "react";
import { Button } from "react-native";
import { getPublicKey, getXPubKey } from "react-native-blockchain-crypto-mpc";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MPCEcdsaKeyShare } from "shared/types/mpc";
import { NavigationRoutes } from "shared/types/navigation";
import { AuthState, authState } from "state/atoms";
import { getPurposeWallet } from "state/utils";
import { VirtualAccount } from "wallet/types/virtual-wallet";
import Wallets from "wallet/view/generic-wallet-view";
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

      const { bitcoinTypeKeyShare: coinTypeWallet, accountMpcKeyShare } =
        result;

      const xPub = await getXPubKey(
        accountMpcKeyShare.keyShare,
        config.IsTestNet ? "test" : "main"
      );

      const virtualAccount = await connectVirtualAccount(accountMpcKeyShare);

      console.log("this is virutal account: ", virtualAccount);

      const internal = await createChangeKeyShare(
        user,
        accountMpcKeyShare,
        virtualAccount,
        "1"
      );
      const external = await createChangeKeyShare(
        user,
        accountMpcKeyShare,
        virtualAccount,
        "0"
      );

      setBitcoin((current: BitcoinWalletsState): BitcoinWalletsState => {
        return {
          ...current,
          coinTypeWallet,
          accounts: [
            ...current.accounts,
            {
              mpcKeyShare: accountMpcKeyShare,
              transactions: [],
              virtualAccount,
              balance: { incoming: 0, outgoing: 0 },
              xPub,
              internal,
              external,
              config: defaultBitcoinAccountConfig,
            },
          ],
        };
      });
      console.log("here it is: ", bitcoinState.accounts);
    };

    onOpen();
  }, []);

  return (
    <Wallets name="Bitcoin">
      {bitcoinState.accounts[0] && (
        <>
          <VirtualBalanceView wallet={bitcoinState.accounts[0]} />

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
            virtualAccount={bitcoinState.accounts[0].virtualAccount!}
          />
        </>
      )}
    </Wallets>
  );
};

export default Bitcoin;
