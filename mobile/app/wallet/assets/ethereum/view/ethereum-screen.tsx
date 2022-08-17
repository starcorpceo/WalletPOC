import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EthereumAccountBuilder } from "ethereum/controller/ethereum-account-creation";
import { EthereumWalletsState, ethereumWalletsState } from "ethereum/state/ethereum-atoms";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { getPurposeWallet } from "state/utils";
import { initialCoinState } from "wallet/state/wallet-state-utils";
import Wallets from "wallet/view/generic-wallet-screen";
import EthereumWalletView from "./wallet/ethereum-wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "EthereumScreen">;

const EthereumScreen = ({ navigation, route }: Props) => {
  const [ethereumState, setEthereum] = useRecoilState<EthereumWalletsState>(ethereumWalletsState);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const { isStateEmpty, user } = route.params;

  const purposeKeyShare = useRecoilValue(getPurposeWallet);

  console.log("Ethereum updated", { ethereumState });

  useEffect(() => {
    const onOpen = async () => {
      if (ethereumState.accounts.length > 0 || !isStateEmpty) return;

      const accountBuilder = new EthereumAccountBuilder(user);

      const newState = await accountBuilder
        .init()
        .then((builder) => {
          setLoadingStep("Creating Ethereum Cointype...");
          return builder.useCoinTypeShare(purposeKeyShare, ethereumState.coinTypeKeyShare);
        })
        .then((builder) => {
          setLoadingStep("Creating Ethereum Wallet...");
          return builder.createAccount(false);
        })
        .then((builder) => {
          setLoadingStep("Creating Bitcoin external chain...");
          return builder.createChange("external");
        })
        .then((builder) => {
          setLoadingStep("Finalizing Wallet...");
          return builder.build();
        });

      setEthereum(() => newState as EthereumWalletsState);
    };

    onOpen();
  }, []);

  const deleteEthereumAccount = useCallback(() => {
    setEthereum((_) => initialCoinState);
    navigation.navigate("Home" as never);
  }, [setEthereum]);

  return (
    <Wallets name="Ethereum">
      <View style={styles.container}>
        <Text style={styles.heading}>Token Wallets</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("TokenUsdcWalletScreen", { wallet: ethereumState.accounts[0] })}
        >
          <Text style={styles.actionButtonText}>USDC Wallet {"\u2192"}</Text>
        </TouchableOpacity>
      </View>
      {ethereumState.accounts[0] && (
        <>
          {ethereumState.accounts.map((wallet, index: number) => (
            <EthereumWalletView key={"EthereumWallet-" + index} wallet={wallet} index={index} navigation={navigation} />
          ))}

          <TouchableOpacity style={styles.deleteButton} onPress={deleteEthereumAccount}>
            <Text style={styles.deleteButtonText}>Delete Ethereum Accounts</Text>
          </TouchableOpacity>
        </>
      )}
      {!ethereumState.accounts[0] && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 6, color: "grey", marginLeft: 8 }}>{loadingStep}</Text>
        </View>
      )}
    </Wallets>
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
    paddingBottom: 24,
    maxHeight: "80%",
    marginBottom: 30,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    marginTop: 12,
  },
  deleteButtonText: {
    fontSize: 17,
    color: "red",
  },
  actionButton: {
    height: 42,
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#3828e0",
  },
  actionButtonText: {
    color: "#3828e0",
    fontSize: 16,
  },
});

export default EthereumScreen;
