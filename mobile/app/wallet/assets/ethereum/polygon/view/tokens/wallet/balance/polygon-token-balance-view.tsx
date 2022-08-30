import { ERC20 } from "@maticnetwork/maticjs/dist/ts/pos/erc20";
import { PolygonERC20Token } from "ethereum/polygon/config/tokens";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TokenBalanceProps = {
  address: string;
  childErc20: ERC20;
  token: PolygonERC20Token;
};

export const TokenBalanceView = ({ address, token, childErc20 }: TokenBalanceProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>();

  useEffect(() => {
    updateBalance();
  }, []);

  const updateBalance = () => {
    const loadBalance = async () => {
      setLoading(true);

      const balance = await childErc20.getBalance(address);

      setTokenBalance(balance);
      setLoading(false);
    };
    loadBalance();
  };

  return (
    <View style={styles.balanceContainer}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.balanceText}>
          {tokenBalance ? Number.parseInt(tokenBalance, 10) / 10 ** token.decimals : "0"} {token.symbol}
        </Text>
        {loading && <ActivityIndicator />}
      </View>
      <TouchableOpacity onPress={updateBalance}>
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
