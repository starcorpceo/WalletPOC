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
import { deriveToMpcWallet } from "wallet/controller/generator";
import Wallets from "wallet/generic-wallet-view";
import CreateBitcoinAdress from "./create/create-bitcoin-address";
import BitcoinWalletListView from "./list/bitcoin-wallet-list";
import { VirtualBalanceView } from "./virtual/virtual-balance";

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

      const internal = await deriveToMpcWallet(
        accountMpcWallet,
        user,
        "1",
        false
      );

      const external = await deriveToMpcWallet(
        accountMpcWallet,
        user,
        "0",
        false
      );

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
                mpcWallet: internal,
                addresses: [],
              },
              external: {
                mpcWallet: external,
                addresses: [],
              },
            },
          ],
        };
      });
    };

    onOpen();
  }, []);

  //console.log("Bitcoin State updated", bitcoinState);

  return (
    <Wallets name="Bitcoin">
      <VirtualBalanceView wallet={bitcoinState.coinTypeWallet} />

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
