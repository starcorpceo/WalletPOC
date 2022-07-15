import React from "react";
import { View } from "react-native";
import { BitcoinWallet } from "wallet/bitcoin";
import { CryptoWallet } from "wallet/wallet";
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
      {wallets.map((wallet: CryptoWallet, index: number) => (
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
