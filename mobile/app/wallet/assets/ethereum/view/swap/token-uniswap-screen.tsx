import "@ethersproject/shims";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Picker } from "@react-native-picker/picker";
import { ERC20Token, erc20Tokens } from "ethereum/config/token-constants";
import { getBalanceFromEthereumTokenBalance } from "ethereum/controller/ethereum-utils";
import { EthereumWallet } from "ethereum/types/ethereum";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import {
  EthereumTokenBalance,
  EthereumTokenBalances,
} from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import "shim";
import { Address } from "wallet/types/wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "TokenUniswapScreen">;

const TokenUniswapScreen = ({ route }: Props) => {
  const [wallet, setWallet] = useState<EthereumWallet>(route.params.wallet);
  const [address, setAddress] = useState<Address>(route.params.wallet.external.addresses[0]);

  const [selectedInputTokenIndex, setSelectedInputTokenIndex] = useState<number>(0);
  const [selectedOutputTokenIndex, setSelectedOutputTokenIndex] = useState<number>(0);

  const [inputValue, setInputValue] = useState<string>();

  useEffect(() => {
    updateBalance(erc20Tokens[0]);
  }, []);

  const updateSelectedInputToken = (index: number) => {
    setSelectedInputTokenIndex(index);
    updateBalance(erc20Tokens[index]);
  };

  const [availableBalance, setAvailableBalance] = useState<EthereumTokenBalance>();
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [service] = useState(new EthereumService("TEST"));
  const updateBalance = (token: ERC20Token) => {
    const loadBalance = async () => {
      setLoadingBalance(true);
      let tokenAddr: string[] = [];
      tokenAddr.push(token.contractAddress);
      const tokenBalances: EthereumTokenBalances = await service.getTokenBalances(
        address.address,
        tokenAddr,
        EthereumProviderEnum.ALCHEMY
      );
      setAvailableBalance(tokenBalances.tokenBalances[0]);
      setLoadingBalance(false);
    };
    loadBalance();
  };

  const swapTokens = () => {
    console.log(
      "Swap " +
        inputValue +
        " " +
        erc20Tokens[selectedInputTokenIndex].symbol +
        " for " +
        erc20Tokens[selectedOutputTokenIndex].name
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Swap with Uniswap</Text>
      <View style={styles.pickerArea}>
        <Text style={styles.pickerHeading}>From</Text>
        <Picker
          style={styles.tokenPicker}
          itemStyle={styles.tokenPickerItem}
          selectedValue={selectedInputTokenIndex}
          onValueChange={(itemValue) => updateSelectedInputToken(itemValue)}
        >
          {erc20Tokens.map((token, index) => {
            return <Picker.Item key={token.name} label={token.name} value={index} />;
          })}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder={"0 " + erc20Tokens[selectedInputTokenIndex]?.symbol}
          onChangeText={(value) => setInputValue(value)}
          value={inputValue}
        ></TextInput>
        <Text style={styles.availableValueText}>
          Available:{" "}
          {availableBalance &&
            !loadingBalance &&
            getBalanceFromEthereumTokenBalance(
              availableBalance,
              erc20Tokens[selectedInputTokenIndex]
            ).value.toString() +
              " " +
              erc20Tokens[selectedInputTokenIndex].symbol}
          {loadingBalance && <ActivityIndicator />}
        </Text>
      </View>
      <Text style={styles.arrowDown}>{"\u2193"}</Text>
      <View style={styles.pickerArea}>
        <Text style={styles.pickerHeading}>To</Text>
        <Picker
          style={styles.tokenPicker}
          itemStyle={styles.tokenPickerItem}
          selectedValue={selectedOutputTokenIndex}
          onValueChange={(itemValue) => setSelectedOutputTokenIndex(itemValue)}
        >
          {erc20Tokens.map((token, index) => {
            return <Picker.Item key={token.name} label={token.name} value={index} />;
          })}
        </Picker>
        <TextInput
          editable={false}
          style={styles.input}
          placeholder={"? " + erc20Tokens[selectedOutputTokenIndex]?.symbol}
        ></TextInput>
      </View>
      <TouchableOpacity style={styles.actionButton} onPress={swapTokens}>
        <Text style={styles.actionButtonText}>Swap</Text>
      </TouchableOpacity>
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
    textAlign: "center",
  },
  pickerArea: {
    justifyContent: "flex-start",
  },
  pickerHeading: {
    position: "absolute",
    marginTop: 20,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "bold",
  },
  tokenPicker: {
    borderRadius: 12,
    borderColor: "lightgrey",
    borderWidth: 1,
    marginTop: 12,
  },
  tokenPickerItem: {
    height: 120,
  },
  arrowDown: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    marginTop: 14,
    borderRadius: 10,
    fontSize: 14,
  },
  actionButton: {
    height: 42,
    width: "100%",
    backgroundColor: "#3828e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
  availableValueText: {
    textAlign: "right",
  },
});

export default TokenUniswapScreen;
