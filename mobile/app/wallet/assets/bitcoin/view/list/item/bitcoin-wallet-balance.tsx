import { getBalanceFromAccount } from "bitcoin/controller/bitcoin-balance";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React, { useState } from "react";
import { Button, Text } from "react-native";
import { Balance } from "wallet/types/wallet";

type BitcoinBalanceProps = {
  wallet: BitcoinWallet;
};

export const BitcoinBalance = ({ wallet }: BitcoinBalanceProps) => {
  const [balance, setBalance] = useState<Balance>();
  const refreshBalance = async () => {
    setBalance(await getBalanceFromAccount(wallet));
  };

  return (
    <>
      {balance && <Text>Balance: {SatoshisToBitcoin(balance.incoming - balance.outgoing)} BTC</Text>}
      <Button onPress={refreshBalance} title="Refresh Balance"></Button>
    </>
  );
};
