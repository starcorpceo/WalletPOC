import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React from "react";
import { Text } from "react-native";
import { useRecoilValue } from "recoil";
import Wallets from "wallet/generic-wallet-view";
import CreateBitcoinWallet from "./create/create";
import BitcoinWalletListView from "./list/wallet-list";

const Bitcoin = () => {
  const bitcoinState = useRecoilValue(bitcoinWalletsState);

  return (
    <Wallets name="Bitcoin">
      <BitcoinWalletListView wallets={bitcoinState} />

      {!walletExists(bitcoinState) && (
        <>
          <Text>Looks like you dont have any Bitcoin Wallets yet</Text>
          <CreateBitcoinWallet />
        </>
      )}
    </Wallets>
  );
};

const walletExists = (bitcoinState: BitcoinWalletsState): boolean =>
  bitcoinState && bitcoinState.length > 0;

export default Bitcoin;
