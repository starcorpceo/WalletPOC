import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React from "react";
import { Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import BitcoinWallet from "./wallet";

const BitcoinWalletList = () => {
  const bitcoinState = useRecoilValue(bitcoinWalletsState);

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        padding: 8,
      }}
    >
      {!walletExists(bitcoinState) && (
        <Text>Looks like you dont have any Bitcoin Wallets yet</Text>
      )}

      {/*
        If time try shorthand:
        {bitcoinState.map(BitcoinWallet)}
      */}
      {bitcoinState.map((wallet, index) => (
        <BitcoinWallet wallet={wallet} index={index} />
      ))}
    </View>
  );
};

const walletExists = (bitcoinState: BitcoinWalletsState): boolean =>
  bitcoinState && bitcoinState.length > 0;

export default BitcoinWalletList;
