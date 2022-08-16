import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import {
  EthereumTokenBalance,
  EthereumTokenBalances,
} from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { Address } from "wallet/types/wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "EthereumERC20TestScreen">;

const EthereumERC20TestScreen = ({ route }: Props) => {
  const [tokenBalanceUSDC, setTokenBalanceUSDC] = useState<EthereumTokenBalance>();
  const wallet = route.params.wallet;
  const [loading, setLoading] = useState<boolean>(false);

  const [service] = useState(new EthereumService("TEST"));

  useEffect(() => {
    updateBalance();
  }, []);

  const updateBalance = () => {
    const loadBalance = async () => {
      let tokenAddr: string[] = [];
      tokenAddr.push("0x07865c6e87b9f70255377e024ace6630c1eaa37f"); //should be usdc
      const tokenBalances: EthereumTokenBalances = await service.getTokenBalances(
        wallet.external.addresses[0].address,
        tokenAddr,
        EthereumProviderEnum.ALCHEMY
      );
      setTokenBalanceUSDC(tokenBalances.tokenBalances[0]);
    };
    setLoading(true);
    loadBalance();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>USDC Wallet</Text>
      <View style={styles.balanceContainer}>
        <View style={{ flexDirection: "row" }}>
          {tokenBalanceUSDC && (
            <Text style={styles.balanceText}>{Number.parseInt(tokenBalanceUSDC?.tokenBalance, 16)} USDC</Text>
          )}
          {!tokenBalanceUSDC && <Text style={styles.balanceText}>0 USDC</Text>}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    margin: 12,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
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

export default EthereumERC20TestScreen;
