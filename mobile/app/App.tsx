/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Bitcoin from "bitcoin/view/bitcoin";
import BitcoinTransactions from "bitcoin/view/transactions";
import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { RecoilRoot } from "recoil";

import Ethereum from "wallet/assets/ethereum/view/ethereum";
import Header from "./shared/header";
import Home from "./views/home";

const App = () => {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#000" : "#fff",
  };

  const Stack = createNativeStackNavigator<NavigationRoutes>();

  return (
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <RecoilRoot>
          <Header />
          <View style={styles.view}>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Bitcoin" component={Bitcoin} />
              <Stack.Screen name="Ethereum" component={Ethereum} />
              <Stack.Screen
                name="BitcoinTransactions"
                component={BitcoinTransactions}
              />
            </Stack.Navigator>
          </View>
        </RecoilRoot>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: "center",
    height: "100%",
  },
});

export default App;
