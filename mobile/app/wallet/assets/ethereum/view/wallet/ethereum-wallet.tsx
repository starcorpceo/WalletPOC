import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ethereumWalletsState } from "ethereum/state/ethereum-atoms";
import { useDeleteMempoolTransaction } from "ethereum/state/ethereum-wallet-state-utils";
import { EthereumWallet } from "ethereum/types/Ethereum";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { useUpdateAccount } from "wallet/state/wallet-state-utils";
import { Transaction } from "wallet/types/wallet";
import { EthereumBalanceView } from "./balance/ethereum-balance-view";
import EthereumTransactionsView from "./transaction/ethereum-transactions-view";

type EthereumWalletProps = {
  wallet: EthereumWallet;
  index: number;
  navigation: NativeStackNavigationProp<NavigationRoutes, "EthereumScreen", undefined>;
};

const EthereumWalletView = ({ wallet, index, navigation }: EthereumWalletProps) => {
  const [service, setService] = useState<EthereumService>();
  const updateWallet = useUpdateAccount<EthereumWallet>(ethereumWalletsState);
  const deleteMempoolTransaction = useDeleteMempoolTransaction(ethereumWalletsState);

  useEffect(() => {
    const onLoad = async () => {
      await updateTransactions();
      updateBalance();
    };
    setService(new EthereumService("TEST"));
    onLoad();
  }, []);

  const updateBalance = useCallback(async () => {
    if (!service) return;

    const balance = await service.getBalance(wallet.external.addresses[0].address, EthereumProviderEnum.ALCHEMY);

    updateWallet(
      {
        ...wallet,
        external: { ...wallet.external, addresses: [{ ...wallet.external.addresses[0], balance: balance.value }] },
      },
      index
    );
  }, [index, updateWallet, service]);

  const updateTransactions = useCallback(async () => {
    if (!service) return;

    const walletUpdate = async () => {
      const transactions = await service.getTransactions(
        wallet.external.addresses[0].address,
        EthereumProviderEnum.ALCHEMY
      );

      const newTransactions = [
        ...(wallet.external.addresses[0].transactions as EthereumTransaction[]),
        ...transactions,
      ];

      updateWallet(
        {
          ...wallet,
          external: {
            ...wallet.external,
            addresses: [
              {
                ...wallet.external.addresses[0],
                transactions: newTransactions.filter(onlyUniqueTransactions),
              },
            ],
          },
        },
        index
      );
    };
    const mempoolUpdate = () => {
      if (wallet.mempool) {
        deleteMempoolTransaction(
          wallet.mempool.findIndex((mempoolTransaction) =>
            wallet.external.addresses[0].transactions.some(
              (newTransaction) => newTransaction.hash === mempoolTransaction.hash
            )
          ),
          wallet
        );
      }
    };
    walletUpdate().then(() => mempoolUpdate());
  }, [index, updateWallet, service, deleteMempoolTransaction]);

  return (
    <View style={styles.container}>
      <View style={styles.headingArea}>
        <Image
          style={styles.icon}
          source={{ uri: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png" }}
        />
        <Text style={styles.heading}>Ethereum Wallet</Text>
      </View>

      <EthereumBalanceView updateBalance={updateBalance} address={wallet.external.addresses[0]} />

      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EthereumReceiveScreen", { account: wallet })}
        >
          <Text style={styles.actionButtonText}>Receive</Text>
        </TouchableOpacity>
        <View style={styles.actionAreaSpace} />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EthereumSendScreen", { account: wallet, service })}
        >
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <EthereumTransactionsView
        wallet={wallet}
        address={wallet.external.addresses[0]}
        navigation={navigation}
        updateTransactions={updateTransactions}
      />
    </View>
  );
};

function onlyUniqueTransactions(value: Transaction, index: number, self: Transaction[]) {
  return self.findIndex((trans) => trans.hash === value.hash) === index;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  headingArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: { width: 14, height: 25, marginRight: 6 },
  actionArea: { flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop: 22, marginBottom: 22 },
  actionAreaSpace: {
    width: 18,
  },
  actionButton: {
    flex: 1,
    height: 42,
    backgroundColor: "#3828e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default EthereumWalletView;
