import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User } from "api-types/user";
import { emptyKeyPair } from "config/constants";
import { deepCompare } from "lib/util";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useRecoilValue } from "recoil";
import { KeyShareType } from "shared/types/mpc";
import { NavigationRoutes } from "shared/types/navigation";
import { getAllWallets, isStateEmpty, useResetWalletState } from "wallet/state/wallet-state-utils";
import GenerateMasterAndPurpose from "wallet/view/create/generate-master-and-purpose";
import ImportMasterAndPurpose from "wallet/view/create/import-master-and-purpose";

type Props = NativeStackScreenProps<NavigationRoutes, "Home">;

const Home = ({ navigation }: Props) => {
  const isDarkMode = useColorScheme() === "dark";
  const resetWallets = useResetWalletState();
  const { account: user, bitcoin, ethereum } = useRecoilValue(getAllWallets);

  console.debug("State Changed: ", { user, bitcoin, ethereum });
  const [loading, setLoading] = useState<number>(0);

  const setLoadingParent = (isLoading: number) => {
    setLoading(isLoading);
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingBottom: "100%" }}>
        <View style={styles.headingArea}>
          <Text style={styles.heading}>Welcome to Vest Wallet</Text>
        </View>

        {isWalletReadyForAccountsView(user) ? (
          <>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("BitcoinScreen", { isStateEmpty: isStateEmpty(bitcoin), user })}
              >
                <Image style={styles.icon} source={{ uri: "https://bitcoin.org/img/icons/opengraph.png?1657703267" }} />
                <Text style={styles.actionButtonText}>Bitcoin Wallet</Text>
              </TouchableOpacity>
              <View style={styles.padding}></View>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("EthereumScreen", { isStateEmpty: isStateEmpty(ethereum), user })}
              >
                <Image
                  style={styles.iconEth}
                  source={{
                    uri: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png",
                  }}
                />
                <Text style={styles.actionButtonText}>Ethereum Wallet</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={resetWallets}>
              <Text style={styles.deleteButtonText}>Reset Coins Locally</Text>
            </TouchableOpacity>
          </>
        ) : loading == 0 ? (
          <>
            <GenerateMasterAndPurpose user={user} setLoading={setLoadingParent} />
            <ImportMasterAndPurpose user={user} setLoading={setLoadingParent} />
          </>
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator />
              {loading == 1 && (
                <Text style={{ marginTop: 6, color: "grey", marginLeft: 8 }}>Generating new Account...</Text>
              )}
              {loading == 2 && (
                <Text style={{ marginTop: 6, color: "grey", marginLeft: 8 }}>Importing Account with Seed...</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={{ width: "100%" }} onPress={() => setLoadingParent(0)}>
        <Text style={{ color: "blue", textAlign: "center" }}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const isWalletReadyForAccountsView = (user: User): boolean => {
  const isMasterEmpty = deepCompare(user.bip44MasterKeyShare, {
    ...emptyKeyPair,
    type: KeyShareType.MASTER,
  });

  const isPurposeEmpty = user.keyShares.length === 0;

  return !isMasterEmpty && !isPurposeEmpty;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    margin: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  headingArea: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 14,
    marginTop: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionButton: {
    flex: 1,
    height: 42,
    backgroundColor: "#3828e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
  },
  deleteButtonText: {
    fontSize: 17,
    color: "red",
  },
  padding: {
    height: 12,
  },
  icon: { width: 20, height: 20, marginRight: 6 },
  iconEth: { width: 13, height: 20, marginRight: 6 },
});

export default Home;
