import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getTransactions } from "bitcoin/controller/virtual/bitcoin-virtual-wallet";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { VirtualAccount, VirtualTransaction } from "wallet/types/virtual-wallet";
import { NavigationRoutes } from "shared/types/navigation";
import { getAllTransactions } from "bitcoin/controller/bitcoin-transaction";
import { Address, Transaction } from "wallet/types/wallet";
import { getNextUnusedAddress } from "bitcoin/controller/bitcoin-address";
import { useRecoilValue } from "recoil";
import { authState, AuthState } from "state/atoms";

type Props = NativeStackScreenProps<NavigationRoutes, "BitcoinTransactions">;

const BitcoinTransactions = ({ route }: Props) => {
  const user = useRecoilValue<AuthState>(authState);

  const [transactions, setTransactions] = useState<Transaction[]>();
  const [receiveAddress, setReceiveAddress] = useState<Address>();

  useEffect(() => {
    const onLoad = async () => {
      const { account } = route.params;
      if (account) setTransactions(getAllTransactions(account!));
    };
    onLoad();
  }, []);

  const showReceiveAddress = async () => {
    const { account } = route.params;
    setReceiveAddress(await getNextUnusedAddress(user, account));
  };

  return (
    <>
      <Text>Transactions</Text>
      {transactions?.map((transaction) => {
        return (
          <View>
            <Text>From: {transaction.outputs[1].address}</Text>
            <Text>Amount: {transaction.outputs[0].value} Satoshis</Text>
          </View>
        );
      })}

      <Button title="Show Address to Receive" onPress={showReceiveAddress} />
      {receiveAddress && <Text>{receiveAddress.address}</Text>}
    </>
  );
};

export default BitcoinTransactions;
