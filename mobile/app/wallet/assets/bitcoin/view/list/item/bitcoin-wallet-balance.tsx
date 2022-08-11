import { getBalanceFromAccount } from "bitcoin/controller/bitcoin-balance";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React, { useState } from "react";
import { Button, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { useUpdateAccountBalance } from "wallet/state/wallet-state-utils";
import { Balance } from "wallet/types/wallet";

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
