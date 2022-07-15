import { BitcoinWallet } from "bitcoin/.";
import { getNetValue } from "bitcoin/controller/bitcoin-wallet";
import React from "react";
import { Button, Text, View } from "react-native";

type BitcionTransactionProps = {
  wallet: BitcoinWallet;
  updateTransactions: () => void;
};

const BitcoinTransactions = ({
  wallet,
  updateTransactions,
}: BitcionTransactionProps) => {
  return (
    <View>
      <Button onPress={updateTransactions} title="Fetch Transactions" />
      <View
        style={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        {wallet?.transactions.map((transaction) => {
          const netValue = getNetValue(wallet.config.address, transaction);
          const isPlus = netValue > 0;
          return (
            <Text
              key={transaction.hash}
              style={{ color: isPlus ? "green" : "red" }}
            >
              {`${isPlus ? "+" : "-"} ${netValue}`} Satoshis
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default BitcoinTransactions;
