import { publicKeyToEthereumAddress } from "ethereum/controller/ethereum-utils";
import { ethereumWalletsState, EthereumWalletsState } from "ethereum/state/atoms";
import { EthereumWallet } from "ethereum/types/ethereum";
import React from "react";
import { View } from "react-native";
import { useSetRecoilState } from "recoil";
import CreateAddress from "wallet/view/create/create-address";
import EthereumWalletView from "./item/ethereum-wallet";

type EthereumWalletListViewProps = {
  wallets: EthereumWallet[];
};

const EthereumWalletListView = ({ wallets }: EthereumWalletListViewProps) => {
  const setEthereum = useSetRecoilState<EthereumWalletsState>(ethereumWalletsState);
  return (
    <View
      style={{
        backgroundColor: "#FFF",
        padding: 8,
      }}
    >
      {wallets.map((wallet, index: number) => (
        <View key={"Wallet-" + index}>
          <EthereumWalletView wallet={wallet} index={index} />
          <CreateAddress
            pubKeyToAddress={publicKeyToEthereumAddress}
            external={wallet.external}
            index={index}
            setCoin={setEthereum}
          />
        </View>
      ))}
    </View>
  );
};

export default EthereumWalletListView;
