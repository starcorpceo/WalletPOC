import "@ethersproject/shims";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { erc20Tokens, ethereum, PolygonERC20Token } from "ethereum/polygon/config/tokens";
import { depositToken, getTokenBalance } from "ethereum/polygon/controller/polygon-token-utils";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";

type Props = NativeStackScreenProps<NavigationRoutes, "PolygonDepositScreen">;

const allTokens = [ethereum, ...erc20Tokens];

const PolygonDepositScreen = ({ route }: Props) => {
  const { address, polygonClient } = route.params;

  const [selectedInputTokenIndex, setSelectedInputTokenIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("0");

  const [availableBalance, setAvailableBalance] = useState<string>();
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

  useEffect(() => {
    updateBalance(allTokens[0]);
  }, []);

  const updateSelectedInputToken = (index: number) => {
    setSelectedInputTokenIndex(index);
    updateBalance(allTokens[index]);
  };

  const updateInputValue = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const updateBalance = async (token: PolygonERC20Token) => {
    setLoadingBalance(true);

    const balance = await getTokenBalance(polygonClient, token.ethereumAddress, address);

    console.log(balance);

    setAvailableBalance(balance);
    setLoadingBalance(false);
  };

  const deposit = useCallback(async () => {
    const deposit = await depositToken(
      polygonClient,
      allTokens[selectedInputTokenIndex].ethereumAddress,
      address,
      parseInt(inputValue, 10)
    );
  }, [polygonClient, inputValue, address, selectedInputTokenIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Deposit from Ethereum to Polygon</Text>
      <View style={styles.pickerArea}>
        <Text style={styles.pickerHeading}>From</Text>
        <Picker
          style={styles.tokenPicker}
          itemStyle={styles.tokenPickerItem}
          selectedValue={selectedInputTokenIndex}
          onValueChange={(itemValue) => updateSelectedInputToken(itemValue)}
        >
          {allTokens.map((token, index) => {
            return <Picker.Item key={token.name} label={token.name} value={index} />;
          })}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder={inputValue + " " + allTokens[selectedInputTokenIndex]?.symbol}
          onChangeText={(value) => updateInputValue(value)}
          value={inputValue}
        ></TextInput>
        <Text style={styles.availableValueText}>
          Available:{" "}
          {availableBalance &&
            !loadingBalance &&
            Number.parseInt(availableBalance, 10) / 10 ** allTokens[selectedInputTokenIndex].decimals +
              " " +
              allTokens[selectedInputTokenIndex].symbol}
          {loadingBalance && <ActivityIndicator />}
        </Text>
      </View>

      <TouchableOpacity
        style={!inputValue ? styles.actionButtonDisabled : styles.actionButton}
        disabled={!inputValue}
        onPress={deposit}
      >
        <Text style={styles.actionButtonText}>Deposit</Text>
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
  actionButtonDisabled: {
    opacity: 0.5,
    height: 42,
    width: "100%",
    backgroundColor: "#3828e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
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
    marginTop: 4,
  },
  routeErrorText: {
    color: "red",
    textAlign: "right",
    fontSize: 12,
    marginTop: 4,
  },
  feesText: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 4,
  },
});

export default PolygonDepositScreen;
