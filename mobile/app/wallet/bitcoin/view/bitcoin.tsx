import { createBitcoinAccount } from "bitcoin/controller/bitcoinjs";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import constants from "config/constants";
import { deriveBIP32NoLocalAuth } from "lib/mpc/deriveBip32";
import React, { useEffect } from "react";
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

      console.log("result", result);

      if (!result) return;

      const { bitcoinTypeWallet, accountMpcWallet } = result;

      const internalShare = await deriveBIP32NoLocalAuth(
        user.devicePublicKey,
        user.id,
        accountMpcWallet.id,
        accountMpcWallet.keyShare,
        "0",
        "0",
        accountMpcWallet.path
      );

      console.log("derive non hardened with server", internalShare);

      // const externalShare = await deriveNonHardenedShare(
      //   accountMpcWallet.keyShare,
      //   0
      // );

      // setBitcoin((current) => {
      //   return {
      //     ...current,
      //     // coinTypeWallet: {
      //     //   ...current.coinTypeWallet,
      //     //   mpcWallet: bitcoinTypeWallet,
      //     // },
      //     accounts: [
      //       ...current.accounts,
      //       {
      //         mpcWallet: accountMpcWallet,
      //         transactions: [],
      //         internal: {
      //           share: internalShare,
      //           addresses: [],
      //         },
      //         external: {
      //           share: externalShare,
      //           addresses: [],
      //         },
      //       },
      //     ],
      //   };
      // });
    };

    onOpen();
  }, []);

  console.log("Bitcoin State updated", bitcoinState);

  return (
    <Wallets name="Bitcoin">
      <BitcoinWalletListView wallets={bitcoinState.accounts} />

      {bitcoinState.accounts[0] && (
        <CreateBitcoinAdress external={bitcoinState.accounts[0].external} />
      )}
    </Wallets>
  );
};

export default Bitcoin;
