import { getBalance } from "bitcoin/controller/virtual/bitcoin-virtual-wallet";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { VirtualBalance } from "wallet/types/virtual-wallet";
import { CoinTypeAccount } from "wallet/types/wallet";

type BitcoinBalanceProps = {
  wallet: CoinTypeAccount;
};

export const VirtualBalanceView = ({ wallet }: BitcoinBalanceProps) => {
  const [balance, setBalance] = useState<VirtualBalance>();
  useEffect(() => {
    const onShow = async () => {
      if (wallet.virtualAccount) {
        const newVirtualBalance = await getBalance(wallet.virtualAccount);
        setBalance(newVirtualBalance);
      }
    };
    onShow();
  }, []);
  return (
    <View>
      <Text>Balance: {balance?.availableBalance} BTC</Text>
    </View>
  );
};
