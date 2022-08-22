import { Picker } from "@react-native-picker/picker";
import { ERC20Token, erc20Tokens } from "ethereum/config/token-constants";
import { getBalanceFromEthereumTokenBalance } from "ethereum/controller/ethereum-utils";
import { getSwapQuote, swapWithQuote } from "ethereum/controller/swap/0x-utils";
import { approveAmount, checkAllowance } from "ethereum/controller/swap/swap-utils";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import { EthereumWallet } from "ethereum/types/ethereum";
import { ethers } from "ethers";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import {
  EthereumTokenBalance,
  EthereumTokenBalances,
} from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import { Api0xSwapQuote } from "packages/blockchain-api-client/src/provider/0x/ethereum/0x-ethereum-types";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { authState, AuthState } from "state/atoms";
import { Address } from "wallet/types/wallet";

import { styles } from "./token-swap-style";

type Props = {
  wallet: EthereumWallet;
  address: Address;
};

//Router contract address from 0x
const ZEROX_SWAP_ROUTER_ADDRESS = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

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

  type refreshProps = {
    inputIndex: number;
    inputValue: string;
    outputIndex: number;
  };
  const refreshQuoteTimer = (props: refreshProps) => {
    clearTimeout(timerRef.current);
    setLoadingQuote(false);
    setQuoteErr(false);
    setQuote(undefined);
    if (inputValue) {
      setLoadingQuote(true);
      timerRef.current = setTimeout(
        () =>
          updateQuote(
            erc20Tokens[props.inputIndex],
            erc20Tokens.filter((token) => token != erc20Tokens[props.inputIndex])[props.outputIndex],
            props.inputValue
          ),
        2000
      );
    }
  };

  const updateSelectedInputToken = (index: number) => {
    setSelectedInputTokenIndex(index);
    updateBalance(erc20Tokens[index]);
    refreshQuoteTimer({ inputIndex: index, inputValue: inputValue!, outputIndex: selectedOutputTokenIndex });
  };

  const [inputValue, setInputValue] = useState<string>();
  const timerRef = useRef<any>();
  const updateInputValue = (inputValue: string) => {
    setInputValue(inputValue);
    refreshQuoteTimer({
      inputIndex: selectedInputTokenIndex,
      inputValue: inputValue,
      outputIndex: selectedOutputTokenIndex,
    });
  };

  const updateSelectedOutputToken = (index: number) => {
    setSelectedOutputTokenIndex(index);
    refreshQuoteTimer({ inputIndex: selectedInputTokenIndex, inputValue: inputValue!, outputIndex: index });
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
  const [quote, setQuote] = useState<Api0xSwapQuote>();
  const [quoteErr, setQuoteErr] = useState<boolean>();
  const updateQuote = async (inputToken: ERC20Token, outputToken: ERC20Token, inputAmount: string) => {
    const inputAmountWei = ethers.utils.parseUnits(inputAmount, inputToken.decimals);
    try {
      const quote = await getSwapQuote(inputToken, outputToken, address.address, inputAmountWei.toString(), service);
      console.log(quote);
      setQuote(quote);
    } catch (err) {
      console.log(err);
      setQuoteErr(true);
    }
    setLoadingQuote(false);
  };

  const swapAlert = () => {
    if (!inputValue || !quote) return;
    Alert.alert(
      "Confirm your swap",
      "You should get " +
        ethers.utils.formatUnits(
          quote.buyAmount,
          erc20Tokens.filter((token) => token != erc20Tokens[selectedInputTokenIndex])[selectedOutputTokenIndex]
            .decimals
        ) +
        " " +
        erc20Tokens.filter((token) => token != erc20Tokens[selectedInputTokenIndex])[selectedOutputTokenIndex].symbol +
        " for " +
        inputValue +
        " " +
        erc20Tokens[selectedInputTokenIndex].symbol +
        " with fee " +
        quote.estimatedGas.toString() +
        " WEI",
      [
        {
          text: "Swap now",
          onPress: () => swapTokens(),
        },
        {
          text: "Cancel",
        },
      ]
    );
  };

  const swapTokens = async () => {
    if (!inputValue || !quote) return;

    const inputAmountWei = ethers.utils.parseUnits(inputValue, erc20Tokens[selectedInputTokenIndex].decimals);

    //check if uniswap has allowance for enough value - else approve new amount
    const allowedAmount = await checkAllowance(
      erc20Tokens[selectedInputTokenIndex],
      address.address,
      signer!.provider!,
      quote.allowanceTarget
    );
    if (!allowedAmount.gte(inputAmountWei)) {
      setApprovalModalVisible(true);
      try {
        if (
          !(await approveAmount(
            erc20Tokens[selectedInputTokenIndex],
            inputAmountWei.sub(allowedAmount),
            signer!,
            quote.allowanceTarget
          ))
        )
          console.error("Could not approve new amount for swapping");
      } catch (err) {
        console.error(err);
        setApprovalModalVisible(false);
      }
      setApprovalModalVisible(false);
    }

    try {
      const swapped = await swapWithQuote(quote, address.address, signer!);
      console.log(swapped);
      Alert.alert(
        "Successfully swapped!",
        "You should get " +
          ethers.utils.formatUnits(
            quote.buyAmount,
            erc20Tokens.filter((token) => token != erc20Tokens[selectedInputTokenIndex])[selectedOutputTokenIndex]
              .decimals
          ) +
          " " +
          erc20Tokens[selectedOutputTokenIndex].symbol
      );
    } catch (err) {
      console.log(err);
      Alert.alert("Unable to swap", "Maybe the route was outdated.");
    }
  };

  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const renderApprovalModal = () => {
    return (
      <Modal
        visible={approvalModalVisible}
        style={{ margin: 40, alignItems: "center", justifyContent: "center" }}
        transparent={true}
      >
        <View style={styles.approvalModalParent}>
          <View style={styles.approvalModalChild}>
            <Text style={styles.heading}>Waiting for approval</Text>
            <ActivityIndicator />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderApprovalModal()}
      <Text style={styles.heading}>Swap with 0x</Text>
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
            (quote
              ? ethers.utils.formatUnits(
                  quote.buyAmount,
                  erc20Tokens.filter((token) => token != erc20Tokens[selectedInputTokenIndex])[selectedOutputTokenIndex]
                    .decimals
                )
              : "?") +
            " " +
            erc20Tokens.filter((token) => token != erc20Tokens[selectedInputTokenIndex])[selectedOutputTokenIndex]
              ?.symbol
          }
        ></TextInput>
        {quoteErr && <Text style={styles.routeErrorText}>No route for this pair</Text>}
        {quote && <Text style={styles.feesText}>{"Fees: " + quote.estimatedGas.toString() + " WEI"}</Text>}
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
