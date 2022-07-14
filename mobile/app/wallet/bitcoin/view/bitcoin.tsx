import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React from "react";
import { Text } from "react-native";
import { useRecoilValue } from "recoil";
import Wallets from "wallet/generic-wallet-view";
import CreateBitcoinWallet from "./create/create";
import BitcoinWalletListView from "./list/wallet-list";

const Bitcoin = () => {
  const bitcoinState = useRecoilValue<BitcoinWalletsState>(bitcoinWalletsState);

  console.log("Bitcoin State updated", bitcoinState);

  return (
    <Wallets name="Bitcoin">
      {walletExists(bitcoinState) ? (
        <>
          <BitcoinWalletListView wallets={bitcoinState.accounts} />
        </>
      ) : (
        <Text>Looks like you dont have any Bitcoin Wallets yet</Text>
      )}
      <CreateBitcoinWallet state={bitcoinState} />
    </Wallets>
  );
};

const walletExists = (bitcoinState: BitcoinWalletsState): boolean =>
  bitcoinState &&
  !!bitcoinState?.coinTypeWallet &&
  bitcoinState.accounts.length > 0;

export default Bitcoin;
