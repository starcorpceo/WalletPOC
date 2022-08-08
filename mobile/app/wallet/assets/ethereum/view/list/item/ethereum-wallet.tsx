import { EthereumWallet } from "ethereum/types/Ethereum";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type EthereumWalletProps = {
  wallet: EthereumWallet;
  index: number;
};

const EthereumWalletView = ({ wallet, index }: EthereumWalletProps) => {
  return (
    <View
      style={{
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        margin: 10,
      }}
    >
      <Text>Addresses</Text>
      <View>
        {wallet.external.addresses.map((addr) => (
          <Text key={addr.publicKey}>
            {addr.address} for path {addr.keyShare.path}
          </Text>
        ))}
        {wallet.internal.addresses.map((addr) => (
          <Text key={addr.publicKey}>
            {addr.address} for path {addr.keyShare.path}
          </Text>
        ))}
      </View>
      {/* <EthereumBalance updateBalance={updateBalance} wallet={wallet} /> */}
      {/*  <EthereumTransactions
    //     updateTransactions={updateTransactions}
    //     wallet={wallet}
    //   />
    //   <SendEthereum user={auth} wallet={wallet} />
    //   <EthereumVirtualAccount wallet={wallet} /> */}
    </View>
  );
};

export default EthereumWalletView;
