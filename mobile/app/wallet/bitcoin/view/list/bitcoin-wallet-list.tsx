import { BitcoinWallet } from "bitcoin/.";
import React from "react";
import { Text, View } from "react-native";
import { VirtualAccount } from "wallet/virtual-wallet";
import CreateBitcoinAdress from "../create/create-bitcoin-address";
import BitcoinWalletView from "./item/bitcoin-wallet";

type BitcoinWalletListViewProps = {
  wallets: BitcoinWallet[];
  virtualAccount: VirtualAccount;
};

const BitcoinWalletListView = ({
  wallets,
  virtualAccount,
}: BitcoinWalletListViewProps) => {
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
          <CreateBitcoinAdress
            external={wallet.external}
            index={index}
            virtualAccount={virtualAccount}
          />
        </>
      ))}
    </View>
  );
};

export default BitcoinWalletListView;
