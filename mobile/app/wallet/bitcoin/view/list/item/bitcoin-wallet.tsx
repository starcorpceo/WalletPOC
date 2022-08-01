import { BitcoinWallet } from "bitcoin/.";
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
      <View>
        {wallet.external.addresses.map((addr) => (
          <>
            <Text key={addr.publicKey}>{addr.address}</Text>
          </>
        ))}
      </View>
      {/* <BitcoinBalance updateBalance={updateBalance} wallet={wallet} /> */}
      {/*  <BitcoinTransactions
    //     updateTransactions={updateTransactions}
    //     wallet={wallet}
    //   />
    //   <SendBitcoin user={auth} wallet={wallet} />
    //   <BitcoinVirtualAccount wallet={wallet} /> */}
    </View>
  );
};

export default BitcoinWalletView;
