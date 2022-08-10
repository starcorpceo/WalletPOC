import { EthereumWallet } from "ethereum/types/Ethereum";
import React from "react";
import { Button, Text, View } from "react-native";

type EthereumTransactionProps = {
  wallet: EthereumWallet;
  updateTransactions: () => void;
};

const EthereumTransactions = ({ wallet, updateTransactions }: EthereumTransactionProps) => {
  return (
    <View>
      <Button onPress={updateTransactions} title="Fetch Transactions" />
      <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
        {wallet?.ethTransactions?.map((transaction) => {
          const isPlus = transaction.value > 0;
          return (
            <Text key={transaction.hash} style={{ color: isPlus ? "green" : "red" }}>
              {`${isPlus ? "+" : "-"} ${transaction.value}`} Eth
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default EthereumTransactions;
