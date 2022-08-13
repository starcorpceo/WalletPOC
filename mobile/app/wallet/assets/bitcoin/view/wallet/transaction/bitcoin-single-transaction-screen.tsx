import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getBalanceFromAccount } from "bitcoin/controller/bitcoin-balance";
import {
  getNetValueFromTransaction,
  getOtherInputs,
  getOtherOutputs,
} from "bitcoin/controller/bitcoin-transaction-utils";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { bitcoinWalletsState } from "bitcoin/state/atoms";
import { useUpdateAccountBalance } from "bitcoin/state/bitcoin-wallet-state-utils";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { BitcoinTransaction } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";

type Props = NativeStackScreenProps<NavigationRoutes, "BitcoinSingleTransactionScreen">;

export const BitcoinSingleTransactionScreen = ({ route }: Props) => {
  const transaction = route.params.transaction;
  const wallet = route.params.wallet;
  const netvalue = getNetValueFromTransaction(transaction, wallet);
  const otherInputs = getOtherInputs(transaction, wallet);
  const otherOutputs = getOtherOutputs(transaction, wallet);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Details</Text>

      <View style={[styles.transaction, { backgroundColor: netvalue < 0 ? "#fcf2f2" : "#f3fcf2" }]}>
        {netvalue < 0 ? (
          otherOutputs.length <= 0 ? (
            <>
              <Text>Sent to yourself stupid</Text>
            </>
          ) : (
            <View>
              <Text style={styles.mediumHeading}>To</Text>
              {otherOutputs.map((otherOutput, index) => {
                return (
                  <Text key={index} style={styles.mediumText}>
                    {otherOutput.address}
                  </Text>
                );
              })}
            </View>
          )
        ) : (
          otherInputs.length > 0 && (
            <View>
              <Text style={styles.mediumHeading}>From</Text>
              {otherInputs.map((otherInput, index) => {
                return (
                  <Text key={index} style={styles.mediumText}>
                    {otherInput.coin.address}
                  </Text>
                );
              })}
            </View>
          )
        )}
        <Text></Text>
        <Text style={{ color: netvalue < 0 ? "red" : "green", alignSelf: "flex-end", marginBottom: 12, fontSize: 17 }}>
          {netvalue >= 0 && "+"}
          {SatoshisToBitcoin(netvalue)} BTC
        </Text>
      </View>

      <View style={styles.moreInfoArea}>
        <Text style={styles.smallHeading}>Hash</Text>
        <Text style={styles.infoText}>{transaction.hash}</Text>

        <Text style={styles.smallHeading}>Time</Text>
        <Text style={styles.infoText}>{new Date(transaction.time * 1000).toString()}</Text>

        <Text style={styles.smallHeading}>Used fees</Text>
        <Text style={styles.infoText}>{transaction.fee} Satoshis</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    margin: 12,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transaction: {
    flexDirection: "column",
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "lightgrey",
  },
  moreInfoArea: {
    marginTop: 12,
  },
  mediumHeading: {
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 17,
  },
  mediumText: {
    fontSize: 17,
  },
  smallHeading: {
    fontWeight: "bold",
    marginTop: 12,
  },
  infoText: {},
});
