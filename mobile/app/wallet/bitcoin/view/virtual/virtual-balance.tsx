import { getBalance } from "bitcoin/controller/bitcoin-virtual-wallet";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { VirtualBalance } from "wallet/virtual-wallet";
import { CoinTypeWallet } from "wallet/wallet";

type BitcoinBalanceProps = {
  wallet: CoinTypeWallet;
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
      <Text>Balance: {balance?.availableBalance}</Text>
    </View>
  );
};
