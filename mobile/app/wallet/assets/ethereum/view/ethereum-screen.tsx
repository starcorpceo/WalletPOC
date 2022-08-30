import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { config } from "ethereum/config/ethereum-config";
import { EthereumAccountBuilder } from "ethereum/controller/ethereum-account-creation";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import { EthereumWalletsState, ethereumWalletsState } from "ethereum/state/ethereum-atoms";
import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { getPurposeWallet } from "state/utils";
import { initialCoinState } from "wallet/state/wallet-state-utils";
import Wallets from "wallet/view/generic-wallet-screen";
import TokenWalletListView from "./tokens/token-wallet-list-view";
import EthereumWalletView from "./wallet/ethereum-wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "EthereumScreen">;

const EthereumScreen = ({ navigation, route }: Props) => {
  const [ethereumState, setEthereum] = useRecoilState<EthereumWalletsState>(ethereumWalletsState);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const { isStateEmpty, user } = route.params;

  const purposeKeyShare = useRecoilValue(getPurposeWallet);

  console.log("Ethereum updated", { ethereumState });
  const [signer, setSigner] = useState<MPCSigner>();

  useEffect(() => {
    const onOpen = async () => {
      if (ethereumState.accounts.length > 0 || !isStateEmpty) {
        setSigner(
          new MPCSigner(ethereumState.accounts[0].external.addresses[0], user).connect(
            new ethers.providers.AlchemyProvider(config.chain, "ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0")
          )
        );
        return;
      }

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

      setSigner(
        new MPCSigner(newState.accounts[0].external.addresses[0], user).connect(ethers.getDefaultProvider(config.chain))
      );
    };

    onOpen();
  }, []);

  const deleteEthereumAccount = useCallback(() => {
    setEthereum((_) => initialCoinState);
    navigation.navigate("Home" as never);
  }, [setEthereum]);

  return (
    <Wallets name="Ethereum">
      {ethereumState.accounts[0] && (
        <>
          {ethereumState.accounts.map((wallet, index: number) => (
            <View key={"EthereumWalletHolder-" + index}>
              <TokenWalletListView wallet={wallet} navigation={navigation} />

              <TouchableOpacity
                style={styles.polygonButton}
                onPress={() =>
                  navigation.navigate("EthereumPolygonScreen", {
                    address: wallet.external.addresses[0].address,
                    signer,
                  })
                }
              >
                <Text style={styles.polygonButtonText}>Manage Ethereum with Polygon</Text>
              </TouchableOpacity>

              <EthereumWalletView
                key={"EthereumWallet-" + index}
                wallet={wallet}
                signer={signer}
                index={index}
                navigation={navigation}
              />
            </View>
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
  polygonButton: {
    flex: 1,
    height: 42,
    backgroundColor: "#1a1e3c",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    margin: 20,
  },
  polygonButtonText: {
    color: "white",
  },
  deleteButtonText: {
    fontSize: 17,
    color: "red",
  },
});

export default EthereumScreen;
