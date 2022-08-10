import { EthereumWallet } from "ethereum/types/Ethereum";
import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React from "react";
import { Button, Text, View } from "react-native";

type EthereumTransactionProps = {
  wallet: EthereumWallet;
  updateTransactions: () => void;
};

const EthereumTransactions = ({ wallet, updateTransactions }: EthereumTransactionProps) => {
  const transactions = wallet.transactions as EthereumTransaction[];
  return (
    <View>
      <Button onPress={updateTransactions} title="Fetch Transactions" />
      <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
        {transactions.map((transaction) => {
          const isPlus = transaction.value > 0;

          const display = isPlus ? "+" + transaction.value : transaction.value;
          return (
            <Text key={transaction.hash} style={{ color: isPlus ? "green" : "red" }}>
              {display} Gwei
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default EthereumTransactions;
