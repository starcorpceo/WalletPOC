import { gWeiToEth } from "ethereum/controller/ethereum-utils";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Address } from "wallet/types/wallet";

type EthereumBalanceProps = {
  address: Address;
  updateBalance: () => Promise<void>;
};

export const EthereumBalanceView = ({ address, updateBalance }: EthereumBalanceProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateBalanceFunction = async () => {
    setLoading(true);
    await updateBalance();
    setLoading(false);
  };

  return (
    <View style={styles.balanceContainer}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.balanceText}>
          {gWeiToEth(address.balance as number)
            .toString()
            .slice(0, 12)}{" "}
          ETH
        </Text>
        {loading && <ActivityIndicator />}
      </View>
      <TouchableOpacity onPress={updateBalanceFunction}>
        <Image
          style={styles.reloadIcon}
          source={{
            uri: "https://cdn.iconscout.com/icon/free/png-256/reload-retry-again-update-restart-refresh-sync-13-3149.png",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 24,
    fontWeight: "normal",
    marginRight: 8,
  },
  reloadIcon: {
    width: 20,
    height: 20,
  },
});
