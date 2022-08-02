import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React from "react";
import { View } from "react-native";
import CreateBitcoinAdress from "../create/create-bitcoin-address";
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
      {wallets.map((wallet, index: number) => (
        <>
          <BitcoinWalletView
            key={"Wallet-" + index}
            wallet={wallet}
            index={index}
          />
          <CreateBitcoinAdress external={wallet.external} index={index} />
        </>
      ))}
    </View>
  );
};

export default BitcoinWalletListView;
