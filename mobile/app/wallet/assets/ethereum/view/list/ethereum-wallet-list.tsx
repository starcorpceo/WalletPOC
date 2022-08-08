import { ethereumWalletsState } from "ethereum/state/atoms";
import { EthereumWallet } from "ethereum/types/ethereum";
import React from "react";
import { View } from "react-native";
import { useUpdateAccount } from "wallet/state/wallet-state-utils";
import CreateAddress from "wallet/view/create/create-address";
import EthereumWalletView from "./item/ethereum-wallet";

type EthereumWalletListViewProps = {
  wallets: EthereumWallet[];
};

const EthereumWalletListView = ({ wallets }: EthereumWalletListViewProps) => {
  const updateWallet = useUpdateAccount<EthereumWallet>(ethereumWalletsState);

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        padding: 8,
      }}
    >
      {wallets.map((wallet, index: number) => (
        <View key={"Wallet-" + index}>
          <EthereumWalletView wallet={wallet} index={index} updateWallet={updateWallet} />
          <CreateAddress wallet={wallet} state={ethereumWalletsState} />
        </View>
      ))}
    </View>
  );
};

export default EthereumWalletListView;
