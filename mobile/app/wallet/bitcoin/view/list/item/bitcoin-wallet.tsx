import {
  getBalance,
  getLatestTransactions,
  getUnspentTransactions,
  getUnspentTransactionsSync,
} from "bitcoin/controller/bitcoin-wallet";
import { useUpdateBitcoinAccountWallet } from "bitcoin/state/atoms";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { AuthState, authState } from "state/atoms";
import { BitcoinWallet } from "wallet/bitcoin";
import { BitcoinBalance } from "./bitcoin-wallet-balance";
import SendBitcoin from "./bitcoin-wallet-send";
import BitcoinTransactions from "./bitcoin-wallet-transactions";

type BitcoinWalletProps = {
  wallet: BitcoinWallet;
  index: number;
};

const BitcoinWalletView = ({ wallet, index }: BitcoinWalletProps) => {
  const auth = useRecoilValue<AuthState>(authState);
  const updateBalance = useUpdateBitcoinAccountWallet(
    useCallback(
      async () => ({
        ...wallet,
        balance: await getBalance(wallet),
      }),
      [wallet]
    )
  );

  const updateTransactions = useUpdateBitcoinAccountWallet(
    useCallback(
      async () => ({
        ...wallet,
        transactions: await getLatestTransactions(wallet, 10, 0),
      }),
      [wallet]
    )
  );

  useEffect(() => {
    getUnspentTransactions(wallet).then((res) =>
      console.log("Got Unspent with Tatum:", res)
    );

    console.log(
      "Got unspent with local Data",
      getUnspentTransactionsSync(wallet)
    );
  }, []);

  return (
    <View
      key={"wallet-" + index}
      style={{
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        margin: 10,
      }}
    >
      <Text>Address: {wallet?.config.address}</Text>

      <BitcoinBalance updateBalance={updateBalance} wallet={wallet} />
      <BitcoinTransactions
        updateTransactions={updateTransactions}
        wallet={wallet}
      />
      <SendBitcoin user={auth} wallet={wallet} />
    </View>
  );
};

export default BitcoinWalletView;
