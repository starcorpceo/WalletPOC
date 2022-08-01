import { createNewVirtualAccount } from "bitcoin/controller/bitcoin-virtual-wallet";
import { createBitcoinAccount } from "bitcoin/controller/bitcoinjs";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import constants from "config/constants";
import {
  deriveBIP32NoLocalAuth,
  deriveNonHardenedShare,
} from "lib/mpc/deriveBip32";
import React, { useEffect } from "react";
import {
  getResultDeriveBIP32,
  getXPubKey,
} from "react-native-blockchain-crypto-mpc";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { getPurposeWallet } from "state/utils";
import Wallets from "wallet/generic-wallet-view";
import CreateBitcoinAdress from "./create/create-bitcoin-address";
import BitcoinWalletListView from "./list/bitcoin-wallet-list";

const Bitcoin = () => {
  const bitcoinState = useRecoilValue<BitcoinWalletsState>(bitcoinWalletsState);
  const user = useRecoilValue<AuthState>(authState);
  const setBitcoin =
    useSetRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  const purposeWallet = useRecoilValue(
    getPurposeWallet({
      masterId: user.bip44MasterWallet?.id as string,
      purposeIndex: constants.bip44PurposeIndex,
    })
  );

  useEffect(() => {
    const onOpen = async () => {
      const result = await createBitcoinAccount(
        bitcoinState,
        user,
        purposeWallet
      );

      if (!result) return;

      const { bitcoinTypeWallet, accountMpcWallet } = result;

      bitcoinTypeWallet.xPub = await getXPubKey(
        bitcoinTypeWallet.keyShare,
        "test"
      );

      const virtualAccount = await createNewVirtualAccount();

      // const internalShare = await deriveNonHardenedShare(
      //   accountMpcWallet.keyShare,
      //   1
      // );

      const internal = await deriveBIP32NoLocalAuth(
        user.devicePublicKey,
        user.id,
        accountMpcWallet.id,
        accountMpcWallet.keyShare,
        "1",
        "0",
        accountMpcWallet.path
      );

      const internalShare = await getResultDeriveBIP32(internal.clientContext);

      const external = await deriveBIP32NoLocalAuth(
        user.devicePublicKey,
        user.id,
        accountMpcWallet.id,
        accountMpcWallet.keyShare,
        "0",
        "0",
        accountMpcWallet.path
      );

      const externalShare = await getResultDeriveBIP32(internal.clientContext);

      setBitcoin((current) => {
        return {
          ...current,
          coinTypeWallet: {
            ...current.coinTypeWallet,
            mpcWallet: bitcoinTypeWallet,
            virtualAccount: virtualAccount,
          },
          accounts: [
            ...current.accounts,
            {
              mpcWallet: accountMpcWallet,
              transactions: [],
              internal: {
                share: internalShare,
                addresses: [],
              },
              external: {
                share: externalShare,
                addresses: [],
              },
            },
          ],
        };
      });
    };

    onOpen();
  }, []);

  console.log("Bitcoin State updated", bitcoinState);

  return (
    <Wallets name="Bitcoin">
      <BitcoinWalletListView wallets={bitcoinState.accounts} />

      {bitcoinState.accounts[0] && (
        <CreateBitcoinAdress
          external={bitcoinState.accounts[0].external}
          virtualAccount={bitcoinState.coinTypeWallet.virtualAccount}
        />
      )}
    </Wallets>
  );
};

export default Bitcoin;
