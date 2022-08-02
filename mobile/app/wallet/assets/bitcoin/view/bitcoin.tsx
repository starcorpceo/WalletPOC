import { config } from "bitcoin/config/bitcoin-config";
import { defaultBitcoinAccountConfig } from "bitcoin/config/bitcoin-constants";
import { createNewVirtualAccount } from "bitcoin/controller/bitcoin-virtual-wallet";
import {
  createBitcoinAccount,
  createChangeKeyShare,
} from "bitcoin/controller/create-addresses";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useEffect } from "react";
import { getXPubKey } from "react-native-blockchain-crypto-mpc";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { getPurposeWallet } from "state/utils";
import Wallets from "wallet/view/generic-wallet-view";
import BitcoinWalletListView from "./list/bitcoin-wallet-list";

const Bitcoin = () => {
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

      const virtualAccount = await createNewVirtualAccount();

      const internal = await createChangeKeyShare(
        user,
        accountMpcKeyShare,
        "1"
      );
      const external = await createChangeKeyShare(
        user,
        accountMpcKeyShare,
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
    };

    onOpen();
  }, []);

  return (
    <Wallets name="Bitcoin">
      <BitcoinWalletListView wallets={bitcoinState.accounts} />
    </Wallets>
  );
};

export default Bitcoin;
