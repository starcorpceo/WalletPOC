import { BitcoinWallet } from "bitcoin/.";
import React from "react";
import { Text, View } from "react-native";
import BitcoinWalletView from "./item/bitcoin-wallet";

type BitcoinWalletListViewProps = {
  wallets: BitcoinWallet[];
};

const BitcoinWalletListView = ({ wallets }: BitcoinWalletListViewProps) => {
  return (
    <View
      style={{
        backgroundColor: "#FFF",
        padding: 8,
      }}
    >
      <Text>Addresses</Text>
      {wallets.map((wallet, index: number) => (
        <BitcoinWalletView
          key={"Wallet-" + index}
          wallet={wallet}
          index={index}
        />
      ))}
    </View>
  );
};

export default BitcoinWalletListView;
