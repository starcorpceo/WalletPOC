import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getNextUnusedAddress } from "bitcoin/controller/bitcoin-address";
import { getAllTransactionsCache } from "bitcoin/controller/bitcoin-transaction";
import {
  getNetValueFromTransaction,
  getOtherInputs,
  getOtherOutputs,
} from "bitcoin/controller/bitcoin-transaction-utils";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { authState, AuthState } from "state/atoms";
import { Address, BitcoinTransaction } from "wallet/types/wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "BitcoinTransactions">;

const BitcoinTransactions = ({ route }: Props) => {
  const user = useRecoilValue<AuthState>(authState);

  const [transactions, setTransactions] = useState<BitcoinTransaction[]>();
  const [receiveAddress, setReceiveAddress] = useState<Address>();

  useEffect(() => {
    const onLoad = async () => {
      const { account } = route.params;
      if (account) setTransactions(getAllTransactionsCache(account!));
    };
    onLoad();
  }, []);

  const showReceiveAddress = async () => {
    const { account } = route.params;
    setReceiveAddress(await getNextUnusedAddress(user, account, "external"));
  };

  return (
    <>
      <Text>Transactions</Text>

      <Button title="Show Address to Receive" onPress={showReceiveAddress} />
      {receiveAddress && <Text>{receiveAddress.address}</Text>}

      <Text></Text>
      {transactions?.map((transaction) => {
        const netvalue = getNetValueFromTransaction(transaction, route.params.account);
        const otherInputs = getOtherInputs(transaction, route.params.account);
        const otherOutputs = getOtherOutputs(transaction, route.params.account);
        return (
          <View style={{ backgroundColor: "lightgrey", marginBottom: 20 }}>
            {netvalue < 0 ? (
              otherOutputs.length <= 0 ? (
                <>
                  <Text>Sent to yourself stupid</Text>
                </>
              ) : (
                <>
                  <Text>To:</Text>
                  <Text>
                    {otherOutputs.map((otherOutput) => {
                      return otherOutput.address;
                    })}
                  </Text>
                </>
              )
            ) : (
              otherInputs.length > 0 && (
                <>
                  <Text>From:</Text>
                  <Text>
                    {otherInputs.map((otherInput) => {
                      return otherInput.coin.address;
                    })}
                  </Text>
                </>
              )
            )}
            <Text></Text>
            <Text style={{ color: netvalue < 0 ? "red" : "green" }}>Amount: {netvalue} Satoshis</Text>
            <Text></Text>
          </View>
        );
      })}
    </>
  );
};

export default BitcoinTransactions;
