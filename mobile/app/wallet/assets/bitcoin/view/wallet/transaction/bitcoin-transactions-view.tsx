import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAllTransactionsCache } from "bitcoin/controller/bitcoin-transaction";
import {
  getNetValueFromTransaction,
  getOtherInputs,
  getOtherOutputs,
  hasOtherAddress,
} from "bitcoin/controller/bitcoin-transaction-utils";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { getUsedAddresses } from "bitcoin/controller/creation/bitcoin-transaction-scanning";
import { bitcoinWalletsState } from "bitcoin/state/atoms";
import { useDeleteMempoolTransaction } from "bitcoin/state/bitcoin-wallet-state-utils";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { Psbt } from "der-bitcoinjs-lib";
import { BitcoinTransaction } from "packages/blockchain-api-client/src/blockchains/bitcoin/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { authState, AuthState } from "state/atoms";
import { useOverrideAddress } from "wallet/state/wallet-state-utils";

type BitcoinTransactionsProps = {
  wallet: BitcoinWallet;
  navigation: NativeStackNavigationProp<NavigationRoutes, "BitcoinScreen">;
};

const BitcoinTransactionsView = ({ wallet, navigation }: BitcoinTransactionsProps) => {
  const [transactions, setTransactions] = useState<BitcoinTransaction[]>();
  const [mempoolTransactions, setMempoolTransactions] = useState<Psbt[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const setOverrideAddress = useOverrideAddress(bitcoinWalletsState);
  const user = useRecoilValue<AuthState>(authState);
  const deleteMempoolTransaction = useDeleteMempoolTransaction(bitcoinWalletsState);

  useEffect(() => {
    const onLoad = async () => {
      setLoading(true);
      if (wallet) setTransactions(getAllTransactionsCache(wallet!));
      if (wallet.mempool) setMempoolTransactions(wallet.mempool);
      setLoading(false);
    };
    onLoad();
  }, []);

  useEffect(() => {
    const resetTransactions = () => {
      if (wallet) setTransactions(getAllTransactionsCache(wallet!));
    };
    resetTransactions();
  }, [wallet]);

  const refreshHistory = async () => {
    setLoading(true);

    const externalAddresses = await getUsedAddresses(user, wallet, "external");
    setOverrideAddress(externalAddresses, wallet, "external");

    const internalAddresses = await getUsedAddresses(user, wallet, "internal");
    setOverrideAddress(internalAddresses, wallet, "internal");

    if (wallet.mempool) {
      deleteMempoolTransaction(
        wallet.mempool.findIndex(
          (mempoolTransaction) =>
            externalAddresses.some((address) =>
              address.transactions.some(
                (transaction) => transaction.hash === mempoolTransaction.extractTransaction().getId()
              )
            ) ||
            internalAddresses.some((address) =>
              address.transactions.some(
                (transaction) => transaction.hash === mempoolTransaction.extractTransaction().getId()
              )
            )
        ),
        wallet
      );
    }
    setLoading(false);
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

      {loading && <ActivityIndicator />}

      {mempoolTransactions?.map((transaction, index) => {
        const otherOutput = transaction.txOutputs.find((output) => hasOtherAddress(output.address!, wallet));
        return (
          <View key={transaction.toHex() + index} style={[styles.transaction, { backgroundColor: "#fcfcde" }]}>
            <View>{otherOutput && <Text>{otherOutput.address?.slice(0, 16) + "..."}</Text>}</View>
            <View style={styles.pendingArea}>
              {otherOutput && (
                <Text style={{ color: "red" }}>
                  -{SatoshisToBitcoin(otherOutput?.value + transaction.getFee())} BTC
                </Text>
              )}
              <Text style={styles.pendingText}>Pending...</Text>
            </View>
          </View>
        );
      })}

      {transactions
        ?.sort(({ time: previousTime }, { time: currentTime }) => currentTime - previousTime)
        .map((transaction) => {
          const netvalue = getNetValueFromTransaction(transaction, wallet);
          const otherInputs = getOtherInputs(transaction, wallet);
          const otherOutputs = getOtherOutputs(transaction, wallet);
          const colorBackground = netvalue < 0 ? "#fcf2f2" : "#f3fcf2";
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
  pendingArea: {
    alignItems: "flex-end",
  },
});

export default BitcoinTransactionsView;
