import React from "react";
import { Button, Text } from "react-native";
import { Address } from "wallet/types/wallet";

type EthereumBalanceProps = {
  address: Address;
  updateBalance: () => Promise<void>;
};

export const EthereumBalance = ({ address, updateBalance }: EthereumBalanceProps) => {
  return (
    <>
      <Text>Balance: {address.balance as number} Gwei</Text>
      <Button onPress={updateBalance} title="Fetch Balance" />
    </>
  );
};
