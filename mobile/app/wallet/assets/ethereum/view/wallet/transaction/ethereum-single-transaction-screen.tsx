import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { gWeiToEth } from "ethereum/controller/ethereum-utils";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";

type Props = NativeStackScreenProps<NavigationRoutes, "EthereumSingleTransactionScreen">;

export const EthereumSingleTransactionScreen = ({ route }: Props) => {
  const transaction = route.params.transaction;
  const wallet = route.params.wallet;
  const [unit, setUnit] = useState<string>("eth");

  const isPlus = transaction.to === wallet.external.addresses[0].address;
  const colorBackground = !isPlus ? "#fcf2f2" : "#f3fcf2";
  const pre = isPlus ? "+" : "-";

  const changeUnit = () => {
    if (unit == "eth") setUnit("gwei");
    else setUnit("eth");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Details</Text>

      <View style={[styles.transaction, { backgroundColor: colorBackground }]}>
        {isPlus ? (
          <View>
            <Text style={styles.mediumText}>From</Text>
            <Text style={styles.mediumText}>{transaction.from}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.mediumText}>To</Text>
            <Text style={styles.mediumText}>{transaction.to}</Text>
          </View>
        )}
        <Text></Text>
        <TouchableOpacity onPress={changeUnit}>
          <Text style={{ color: isPlus ? "green" : "red", alignSelf: "flex-end", marginBottom: 12, fontSize: 17 }}>
            {unit == "eth" && pre + gWeiToEth(transaction.value).toString().slice(0, 10) + " ETH"}
            {unit == "gwei" && pre + transaction.value.toString().slice(0, 10) + " gWei"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.moreInfoArea}>
        <Text style={styles.smallHeading}>Hash</Text>
        <Text style={styles.infoText}>{transaction.hash}</Text>

        <Text style={styles.smallHeading}>Blocknumber</Text>
        <Text style={styles.infoText}>{transaction.blockNum.toString()}</Text>
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
