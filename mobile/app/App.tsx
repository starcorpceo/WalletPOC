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
import BitcoinScreen from "bitcoin/view/bitcoin-screen";
import BitcoinReceiveScreen from "bitcoin/view/wallet/receive/bitcoin-receive-screen";
import BitcoinSendScreen from "bitcoin/view/wallet/send/bitcoin-send-screen";
import { BitcoinSingleTransactionScreen } from "bitcoin/view/wallet/transaction/bitcoin-single-transaction-screen";
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { RecoilRoot } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";

import EthereumScreen from "ethereum/view/ethereum-screen";
import Header from "./shared/header";
import Home from "./views/home";
import EthereumReceiveScreen from "ethereum/view/wallet/receive/ethereum-receive-screen";
import EthereumSendScreen from "ethereum/view/wallet/send/ethereum-send-screen";
import { EthereumSingleTransactionScreen } from "ethereum/view/wallet/transaction/ethereum-single-transaction-screen";
import TokenUsdcWalletScreen from "ethereum/view/tokens/usdc/token-usdc-wallet";

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

              <Stack.Screen name="EthereumScreen" component={EthereumScreen} />
              <Stack.Screen
                name="EthereumSendScreen"
                component={EthereumSendScreen}
                options={{ title: "Send Ethereum" }}
              />
              <Stack.Screen
                name="EthereumReceiveScreen"
                component={EthereumReceiveScreen}
                options={{ title: "Receive Ethereum" }}
              />
              <Stack.Screen
                name="EthereumSingleTransactionScreen"
                component={EthereumSingleTransactionScreen}
                options={{ title: "Transaction Details" }}
              />
              <Stack.Screen
                name="TokenUsdcWalletScreen"
                component={TokenUsdcWalletScreen}
                options={{ title: "ERC-20" }}
              />

              <Stack.Screen name="BitcoinScreen" component={BitcoinScreen} options={{ title: "All wallets" }} />
              <Stack.Screen
                name="BitcoinSendScreen"
                component={BitcoinSendScreen}
                options={{ title: "Send Bitcoin" }}
              />
              <Stack.Screen
                name="BitcoinReceiveScreen"
                component={BitcoinReceiveScreen}
                options={{ title: "Receive Bitcoin" }}
              />
              <Stack.Screen
                name="BitcoinSingleTransactionScreen"
                component={BitcoinSingleTransactionScreen}
                options={{ title: "Transaction Details" }}
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
