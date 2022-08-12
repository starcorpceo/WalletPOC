import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User } from "api-types/user";
import { emptyKeyPair } from "config/constants";
import { deepCompare } from "lib/util";
import React from "react";
import { Button, ScrollView, StyleProp, Text, TextStyle, useColorScheme, View } from "react-native";
import { useRecoilValue } from "recoil";
import { KeyShareType } from "shared/types/mpc";
import { NavigationRoutes } from "shared/types/navigation";
import "shim";
import { getAllWallets, isStateEmpty, useResetWalletState } from "wallet/state/wallet-state-utils";
import GenerateMasterAndPurpose from "wallet/view/create/generate-master-and-purpose";
import ImportMasterAndPurpose from "wallet/view/create/import-master-and-purpose";

type Props = NativeStackScreenProps<NavigationRoutes, "Home">;

const Home = ({ navigation }: Props) => {
  const isDarkMode = useColorScheme() === "dark";
  const resetWallets = useResetWalletState();
  const { account: user, bitcoin, ethereum } = useRecoilValue(getAllWallets);

  console.debug("State Changed: ", { user, bitcoin, ethereum });

  const textStyle: StyleProp<TextStyle> = {
    color: isDarkMode ? "#fff" : "#000",
    fontWeight: "700",
    textAlign: "center",
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingBottom: "100%" }}>
        <Text style={textStyle}>Welcome to Secure Wallet</Text>

        {isWalletReadyForAccountsView(user) ? (
          <>
            <Button
              onPress={() => navigation.navigate("Bitcoin", { isStateEmpty: isStateEmpty(bitcoin), user })}
              title="Bitcoin"
            />
            <Button
              onPress={() => navigation.navigate("Ethereum", { isStateEmpty: isStateEmpty(ethereum), user })}
              title="Ethereum"
            />
            <Button onPress={resetWallets} title="Reset Coins Locally" />
          </>
        ) : (
          <>
            <Text>
              You dont have an Account with Corresponding Wallets yet. Import or derive a Master Key (BIP44 root)
            </Text>
            <GenerateMasterAndPurpose user={user} />
            <ImportMasterAndPurpose user={user} />
          </>
        )}
      </ScrollView>
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

export default Home;
