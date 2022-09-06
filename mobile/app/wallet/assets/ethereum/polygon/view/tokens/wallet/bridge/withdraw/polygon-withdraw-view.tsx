import { POSClient } from "@maticnetwork/maticjs";
import { PlasmaClient } from "@maticnetwork/maticjs-plasma";
import { Picker } from "@react-native-picker/picker";
import { erc20Tokens, PolygonERC20Token } from "ethereum/polygon/config/tokens";
import { polygonState } from "ethereum/polygon/state/polygon-atoms";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";
import { styles } from "../polygon-bridge-style";

type Props = {
  address: string;
  posClient: POSClient;
  plasmaClient: PlasmaClient;
};

const PolygonWithdrawView = ({ address, posClient, plasmaClient }: Props) => {
  const [polygonWithdrawState, setPolygonWithdrawState] = useRecoilState(polygonState);
  const [selectedInputTokenIndex, setSelectedInputTokenIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("0");

  const [availableBalance, setAvailableBalance] = useState<string>();
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

  useEffect(() => {
    updateBalance(erc20Tokens[0]);
  }, []);

  const updateSelectedInputToken = (index: number) => {
    setSelectedInputTokenIndex(index);
    updateBalance(erc20Tokens[index]);
  };

  const updateInputValue = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const updateBalance = async (token: PolygonERC20Token) => {
    setLoadingBalance(true);

    const childErc20 = posClient.erc20(token.polygonAddress, false);

    const balance = await childErc20.getBalance(address);

    setAvailableBalance(balance);
    setLoadingBalance(false);
  };

  const withdraw = useCallback(async () => {
    const token = erc20Tokens[selectedInputTokenIndex];

    const client = token.isToken ? posClient : plasmaClient;

    const childErc20 = client.erc20(token.polygonAddress, false);

    const withdraw = await childErc20.withdrawStart(inputValue);
    const withdrawStartTransaction = await withdraw.getTransactionHash();

    setPolygonWithdrawState((current) => ({
      ...current,
      withdrawTransactions: [
        ...current.withdrawTransactions,
        { token, hash: withdrawStartTransaction, checkpointed: false, amount: inputValue },
      ],
    }));

    Alert.alert("Withdraw is now pending");
  }, [posClient, plasmaClient, inputValue, address, selectedInputTokenIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Withdraw from Polygon to Ethereum</Text>
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
          placeholder={inputValue + " " + erc20Tokens[selectedInputTokenIndex]?.symbol}
          onChangeText={(value) => updateInputValue(value)}
          value={inputValue}
        ></TextInput>
        <Text style={styles.availableValueText}>
          Available:{" "}
          {availableBalance &&
            !loadingBalance &&
            Number.parseInt(availableBalance, 10) / 10 ** erc20Tokens[selectedInputTokenIndex].decimals +
              " " +
              erc20Tokens[selectedInputTokenIndex].symbol}
          {loadingBalance && <ActivityIndicator />}
        </Text>
      </View>

      <TouchableOpacity
        style={!inputValue ? styles.actionButtonDisabled : styles.actionButton}
        disabled={!inputValue}
        onPress={withdraw}
      >
        <Text style={styles.actionButtonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PolygonWithdrawView;
