import { getBalanceFromAccount } from "bitcoin/controller/bitcoin-balance";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { bitcoinWalletsState } from "bitcoin/state/bitcoin-atoms";
import { useUpdateAccountBalance } from "bitcoin/state/bitcoin-wallet-state-utils";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BitcoinBalanceProps = {
  wallet: BitcoinWallet;
};

export const BitcoinBalanceView = ({ wallet }: BitcoinBalanceProps) => {
  const updateBalance = useUpdateAccountBalance(bitcoinWalletsState);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshBalance = async () => {
    setLoading(true);
    updateBalance(await getBalanceFromAccount(wallet), wallet);
    setLoading(false);
  };

  return (
    <View style={styles.balanceContainer}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.balanceText}>
          {SatoshisToBitcoin(wallet.balance.incoming - wallet.balance.outgoing)} BTC
        </Text>
        {loading && <ActivityIndicator />}
      </View>
      <TouchableOpacity onPress={refreshBalance}>
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
