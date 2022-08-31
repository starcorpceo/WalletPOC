import { POSClient } from "@maticnetwork/maticjs";
import { Picker } from "@react-native-picker/picker";
import { erc20Tokens, ethereum, PolygonERC20Token } from "ethereum/polygon/config/tokens";
import { depositToken, getTokenBalance } from "ethereum/polygon/controller/polygon-token-utils";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./polygon-bridge-style";

type Props = {
  address: string;
  polygonClient: POSClient;
};
const allTokens: PolygonERC20Token[] = [ethereum, ...erc20Tokens];

const PolygonDepositView = ({ address, polygonClient }: Props) => {
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
    const receipt = await depositToken(
      polygonClient,
      allTokens[selectedInputTokenIndex].ethereumAddress,
      address,
      parseInt(inputValue, 10)
    );

    receipt && Alert.alert("Successfully deposited");
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

export default PolygonDepositView;
