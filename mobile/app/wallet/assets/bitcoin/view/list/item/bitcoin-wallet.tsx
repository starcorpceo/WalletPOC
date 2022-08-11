import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BitcoinWalletProps = {
  wallet: BitcoinWallet;
  index: number;
};

const BitcoinWalletView = ({ wallet, index }: BitcoinWalletProps) => {
  return (
    <View
      key={"wallet-" + index}
      style={{
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        margin: 10,
      }}
    >
      <Text>Addresses</Text>
      <View>
        {wallet.external.addresses.map((addr) => (
          <>
            <Text key={addr.publicKey.toString()}>{addr.address}</Text>
            <Text>Transactions count: {addr.transactions.length}</Text>
          </>
        ))}
      </View>
    </View>
  );
};

export default BitcoinWalletView;
