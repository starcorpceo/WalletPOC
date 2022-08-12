import { getBalanceFromAccount } from "bitcoin/controller/bitcoin-balance";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { bitcoinWalletsState } from "bitcoin/state/bitcoin-atoms";
import { useUpdateAccountBalance } from "bitcoin/state/bitcoin-wallet-state-utils";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React from "react";
import { Button, Text } from "react-native";

type BitcoinBalanceProps = {
  wallet: BitcoinWallet;
};

export const BitcoinBalance = ({ wallet }: BitcoinBalanceProps) => {
  const updateBalance = useUpdateAccountBalance(bitcoinWalletsState);

  const refreshBalance = async () => {
    updateBalance(await getBalanceFromAccount(wallet), wallet);
  };

  return (
    <>
      {wallet && <Text>Balance: {SatoshisToBitcoin(wallet.balance.incoming - wallet.balance.outgoing)} BTC</Text>}
      <Button onPress={refreshBalance} title="Refresh Balance"></Button>
    </>
  );
};
