import { createNewVirtualAccount } from "bitcoin/controller/bitcoin-virtual-wallet";
import {
  createBitcoinAccount,
  createChangeKeyShare,
} from "bitcoin/controller/create-addresses";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { getPurposeWallet } from "state/utils";
import Wallets from "wallet/generic-wallet-view";
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

      const { bitcoinTypeKeyShare, account } = result;

      const virtualAccount = await createNewVirtualAccount();

      const internal = await createChangeKeyShare(user, account, "1");
      const external = await createChangeKeyShare(user, account, "0");

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
      <BitcoinWalletListView wallets={bitcoinState.accounts} />
    </Wallets>
  );
};

export default Bitcoin;
