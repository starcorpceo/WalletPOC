import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User } from "api-types/user";
import { emptyKeyPair } from "config/constants";
import { deepCompare } from "lib/util";
import React from "react";
import {
  Button,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  useColorScheme,
  View,
} from "react-native";
import { useRecoilValue } from "recoil";
import { KeyShareType } from "shared/types/mpc";
import { NavigationRoutes } from "shared/types/navigation";
import "shim";
import { AuthState, authState } from "state/atoms";
import GenerateWallet from "wallet/view/create/generate-wallet";
import ImportWallet from "wallet/view/create/import-wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "Home">;

const Home = ({ navigation }: Props) => {
  const isDarkMode = useColorScheme() === "dark";
  const user = useRecoilValue<AuthState>(authState);

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
              onPress={() => navigation.navigate("Bitcoin")}
              title="Bitcoin"
            />
            <Button
              onPress={() => navigation.navigate("Ethereum")}
              title="Ethereum"
            />
          </>
        ) : (
          <>
            <Text>
              You dont have an Account with Corresponding Wallets yet. Import or
              derive a Master Key (BIP44 root)
            </Text>
            <GenerateWallet user={user} />
            <ImportWallet user={user} />
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
