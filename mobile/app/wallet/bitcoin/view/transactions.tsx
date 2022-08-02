import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getTransactions } from "bitcoin/controller/bitcoin-virtual-wallet";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { VirtualAccount, VirtualTransaction } from "wallet/virtual-wallet";
import { NavigationRoutes } from "../../../shared/navigation";

type Props = NativeStackScreenProps<NavigationRoutes, "BitcoinTransactions">;

const BitcoinTransactions = ({ route }: Props) => {
  const [transactions, setTransactions] = useState<any[]>();

  useEffect(() => {
    const onLoad = async () => {
      const { account } = route.params;
      if (account) setTransactions(await getTransactions(account!));
    };
    onLoad();
  }, []);

  return (
    <>
      <Text>Transactions</Text>
      {transactions?.map((transaction) => {
        return (
          <View>
            <Text>To: {transaction.address}</Text>
            <Text>Amount: {transaction.amount} BTC</Text>
          </View>
        );
      })}
    </>
  );
};

export default BitcoinTransactions;
