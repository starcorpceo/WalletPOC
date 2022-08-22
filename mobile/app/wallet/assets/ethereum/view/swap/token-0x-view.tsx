import { Picker } from "@react-native-picker/picker";
import { ERC20Token, erc20Tokens } from "ethereum/config/token-constants";
import { getBalanceFromEthereumTokenBalance } from "ethereum/controller/ethereum-utils";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import { EthereumWallet } from "ethereum/types/ethereum";
import { ethers } from "ethers";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import {
  EthereumTokenBalance,
  EthereumTokenBalances,
} from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { authState, AuthState } from "state/atoms";
import { Address } from "wallet/types/wallet";

import { styles } from "./token-swap-style";

type Props = {
  wallet: EthereumWallet;
  address: Address;
};

const Token0xView = ({ wallet, address }: Props) => {
  const user = useRecoilValue<AuthState>(authState);

  const [selectedInputTokenIndex, setSelectedInputTokenIndex] = useState<number>(0);
  const [selectedOutputTokenIndex, setSelectedOutputTokenIndex] = useState<number>(0);

  const [signer, setSigner] = useState<MPCSigner>();
  useEffect(() => {
    setSigner(
      new MPCSigner(wallet.external.addresses[0], user).connect(
        new ethers.providers.AlchemyProvider("goerli", "ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0")
      )
    );
    updateBalance(erc20Tokens[0]);
  }, []);

  const updateSelectedInputToken = (index: number) => {
    setSelectedInputTokenIndex(index);
    updateBalance(erc20Tokens[index]);
  };

  const [inputValue, setInputValue] = useState<string>();
  const timerRef = useRef<any>();
  const updateInputValue = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const updateSelectedOutputToken = (index: number) => {
    setSelectedOutputTokenIndex(index);
  };

  const [availableBalance, setAvailableBalance] = useState<EthereumTokenBalance>();
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [service] = useState(new EthereumService("TEST"));
  const updateBalance = async (token: ERC20Token) => {
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

  const [loadingQuote, setLoadingQuote] = useState<boolean>(false);
  const [quote, setQuote] = useState<any>();
  const [quoteErr, setQuoteErr] = useState<boolean>();
  const updateQuote = async (inputToken: ERC20Token, outputToken: ERC20Token, inputAmount: string) => {};

  const swapAlert = () => {};

  const swapTokens = async () => {};

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
          onChangeText={(value) => updateInputValue(value)}
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
      {loadingQuote ? <ActivityIndicator /> : <Text style={styles.arrowDown}>{"\u2193"}</Text>}
      <View style={styles.pickerArea}>
        <Text style={styles.pickerHeading}>To</Text>
        <Picker
          style={styles.tokenPicker}
          itemStyle={styles.tokenPickerItem}
          selectedValue={selectedOutputTokenIndex}
          onValueChange={(itemValue) => updateSelectedOutputToken(itemValue)}
        >
          {erc20Tokens
            .filter((token) => token != erc20Tokens[selectedInputTokenIndex])
            .map((token, index) => {
              return <Picker.Item key={token.name} label={token.name} value={index} />;
            })}
        </Picker>
        <TextInput
          editable={false}
          style={styles.input}
          value={
            (quote ? quote.quote.toFixed() : "?") +
            " " +
            erc20Tokens.filter((token) => token != erc20Tokens[selectedInputTokenIndex])[selectedOutputTokenIndex]
              ?.symbol
          }
        ></TextInput>
        {quoteErr && <Text style={styles.routeErrorText}>No route for this pair</Text>}
        {quote && <Text style={styles.feesText}>{"Fees: " + quote.estimatedGasUsed.toString() + " WEI"}</Text>}
      </View>
      <TouchableOpacity
        style={!inputValue || !quote || quoteErr ? styles.actionButtonDisabled : styles.actionButton}
        disabled={!inputValue || !quote || quoteErr}
        onPress={() => swapAlert()}
      >
        <Text style={styles.actionButtonText}>Swap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Token0xView;
