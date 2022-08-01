import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { emptyMasterKeyPair } from "config/constants";
import { deepCompare } from "lib/string";
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
import "shim";
import { AuthState, authState } from "state/atoms";
import GenerateWallet from "wallet/view/create/generate-wallet";
import ImportWallet from "wallet/view/create/import-wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "Home">;

const Home = ({ navigation }: Props) => {
  const isDarkMode = useColorScheme() === "dark";
  const user = useRecoilValue<AuthState>(authState);

  console.log(user);

  const textStyle: StyleProp<TextStyle> = {
    color: isDarkMode ? "#fff" : "#000",
    fontWeight: "700",
    textAlign: "center",
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingBottom: "100%" }}>
        <Text style={textStyle}>Welcome to Secure Wallet</Text>

        {deepCompare(user.bip44MasterKeyShare, emptyMasterKeyPair) ? (
          <>
            <Text>
              You dont have an Account with Corresponding Wallets yet. Import or
              derive a Master Key (BIP44 root)
            </Text>
            <GenerateWallet user={user} />
            <ImportWallet user={user} />
          </>
        ) : (
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
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
