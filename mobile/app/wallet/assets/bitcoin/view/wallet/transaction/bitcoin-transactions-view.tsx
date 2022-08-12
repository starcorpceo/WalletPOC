import { NavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { getNextUnusedAddress } from "bitcoin/controller/bitcoin-address";
import { getAllTransactionsCache } from "bitcoin/controller/bitcoin-transaction";
import {
  getNetValueFromTransaction,
  getOtherInputs,
  getOtherOutputs,
} from "bitcoin/controller/bitcoin-transaction-utils";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { BitcoinTransaction } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { authState, AuthState } from "state/atoms";
import { Address } from "wallet/types/wallet";

type BitcoinTransactionsProps = {
  wallet: BitcoinWallet;
  navigation: NativeStackNavigationProp<NavigationRoutes, "BitcoinScreen">;
};

const BitcoinTransactionsView = ({ wallet, navigation }: BitcoinTransactionsProps) => {
  const [transactions, setTransactions] = useState<BitcoinTransaction[]>();

  useEffect(() => {
    const onLoad = async () => {
      if (wallet) setTransactions(getAllTransactionsCache(wallet!));
    };
    onLoad();
  }, []);

  return (
    <>
      <Text style={styles.heading}>History</Text>

      {transactions?.map((transaction) => {
        const netvalue = getNetValueFromTransaction(transaction, wallet);
        const otherInputs = getOtherInputs(transaction, wallet);
        const otherOutputs = getOtherOutputs(transaction, wallet);
        return (
          <TouchableOpacity
            key={transaction.hash}
            onPress={() => navigation.navigate("BitcoinSingleTransactionScreen", { transaction, wallet })}
            style={[styles.transaction, { backgroundColor: netvalue < 0 ? "#fcf2f2" : "#f3fcf2" }]}
          >
            {netvalue < 0 ? (
              otherOutputs.length <= 0 ? (
                <>
                  <Text>Sent to yourself stupid</Text>
                </>
              ) : (
                <View>
                  {otherOutputs.map((otherOutput) => {
                    return <Text>{otherOutput.address.slice(0, 16) + "..."}</Text>;
                  })}
                </View>
              )
            ) : (
              otherInputs.length > 0 && (
                <View>
                  {otherInputs.map((otherInput) => {
                    return <Text>{otherInput.coin.address.slice(0, 16) + "..."}</Text>;
                  })}
                </View>
              )
            )}
            <Text style={{ color: netvalue < 0 ? "red" : "green" }}>
              {netvalue >= 0 && "+"}
              {SatoshisToBitcoin(netvalue)} BTC
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    fontWeight: "bold",
  },
  transaction: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "lightgrey",
  },
});

export default BitcoinTransactionsView;
