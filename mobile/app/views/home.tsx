import { NativeStackScreenProps } from "@react-navigation/native-stack";
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

type Props = NativeStackScreenProps<NavigationRoutes, "Home">;

const Home = ({ navigation }: Props) => {
  const isDarkMode = useColorScheme() === "dark";

  const textStyle: StyleProp<TextStyle> = {
    color: isDarkMode ? "#fff" : "#000",
    fontWeight: "700",
    textAlign: "center",
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingBottom: "100%" }}>
        <Text style={textStyle}>Welcome to Secure Wallet</Text>
        <Button
          onPress={() => navigation.navigate("TestMpc")}
          title="Test MPC Key Handling"
        />
        <Button
          onPress={() => navigation.navigate("Wallets")}
          title="Go to Wallet View"
        />
      </ScrollView>
    </View>
  );
};

export default Home;
