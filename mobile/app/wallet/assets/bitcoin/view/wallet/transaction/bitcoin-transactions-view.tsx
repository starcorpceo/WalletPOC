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
import { getUsedAddresses } from "bitcoin/controller/creation/bitcoin-transaction-scanning";
import { bitcoinWalletsState } from "bitcoin/state/atoms";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { BitcoinTransaction } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { authState, AuthState } from "state/atoms";
import { useAddAddress, useOverrideAddress } from "wallet/state/wallet-state-utils";
import { Address } from "wallet/types/wallet";

type BitcoinTransactionsProps = {
  wallet: BitcoinWallet;
  navigation: NativeStackNavigationProp<NavigationRoutes, "BitcoinScreen">;
};

const BitcoinTransactionsView = ({ wallet, navigation }: BitcoinTransactionsProps) => {
  const [transactions, setTransactions] = useState<BitcoinTransaction[]>();
  const setOverrideAddress = useOverrideAddress(bitcoinWalletsState);
  const user = useRecoilValue<AuthState>(authState);

  useEffect(() => {
    const onLoad = async () => {
      if (wallet) setTransactions(getAllTransactionsCache(wallet!));
    };
    onLoad();
  }, []);

  const refreshHistory = async () => {
    setOverrideAddress(await getUsedAddresses(user, wallet, "external"), wallet, "external");
    setOverrideAddress(await getUsedAddresses(user, wallet, "internal"), wallet, "internal");
  };

  return (
    <>
      <View style={styles.headingArea}>
        <Text style={styles.heading}>History</Text>
        <TouchableOpacity onPress={refreshHistory}>
          <Image
            style={styles.reloadIcon}
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/reload-retry-again-update-restart-refresh-sync-13-3149.png",
            }}
          />
        </TouchableOpacity>
      </View>

      {transactions?.map((transaction) => {
        const netvalue = getNetValueFromTransaction(transaction, wallet);
        const otherInputs = getOtherInputs(transaction, wallet);
        const otherOutputs = getOtherOutputs(transaction, wallet);
        const colorBackground = !transaction.blockNumber ? "#fffff0" : netvalue < 0 ? "#fcf2f2" : "#f3fcf2";
        const colorText = netvalue < 0 ? "red" : "green";
        return (
          <TouchableOpacity
            key={transaction.hash}
            onPress={() => navigation.navigate("BitcoinSingleTransactionScreen", { transaction, wallet })}
            style={[styles.transaction, { backgroundColor: colorBackground }]}
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
            <Text style={{ color: colorText }}>
              {netvalue >= 0 && "+"}
              {SatoshisToBitcoin(netvalue)} BTC
            </Text>
            {!transaction.blockNumber && <Text style={styles.pendingText}>Pending</Text>}
          </TouchableOpacity>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  headingArea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
  reloadIcon: {
    width: 16,
    height: 16,
  },
  pendingText: {},
});

export default BitcoinTransactionsView;
