import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React from "react";
import { Button, Text } from "react-native";

type BitcoinBalanceProps = {
  wallet: BitcoinWallet;
  updateBalance: () => void;
};

export const BitcoinBalance = ({
  wallet,
  updateBalance,
}: BitcoinBalanceProps) => {
  return (
    <>
      {wallet.balance && (
        <Text>
          Balance: {wallet.balance.incoming - wallet.balance.outgoing} BTC
        </Text>
      )}
      <Button onPress={updateBalance} title="Fetch Balance" />
    </>
  );
};
