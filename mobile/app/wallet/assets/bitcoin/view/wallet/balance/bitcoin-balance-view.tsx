import { getBalanceFromAccount } from "bitcoin/controller/bitcoin-balance";
import { SatoshisToBitcoin } from "bitcoin/controller/bitcoin-utils";
import { bitcoinWalletsState } from "bitcoin/state/atoms";
import { useUpdateAccountBalance } from "bitcoin/state/bitcoin-wallet-state-utils";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BitcoinBalanceProps = {
  wallet: BitcoinWallet;
};

export const BitcoinBalanceView = ({ wallet }: BitcoinBalanceProps) => {
  const updateBalance = useUpdateAccountBalance(bitcoinWalletsState);

  const refreshBalance = async () => {
    updateBalance(await getBalanceFromAccount(wallet), wallet);
  };

  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceText}>{SatoshisToBitcoin(wallet.balance.incoming - wallet.balance.outgoing)} BTC</Text>
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
  },
  reloadIcon: {
    width: 20,
    height: 20,
  },
});
