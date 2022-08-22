import "@ethersproject/shims";
import { Picker } from "@react-native-picker/picker";
import { SwapRoute } from "@uniswap/smart-order-router";
import { ERC20Token, erc20Tokens } from "ethereum/config/token-constants";
import { getBalanceFromEthereumTokenBalance } from "ethereum/controller/ethereum-utils";
import { approveAmount, checkAllowance } from "ethereum/controller/swap/swap-utils";
import { findRouteExactInput, swapWithRoute } from "ethereum/controller/swap/uniswap-utils";
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
import "shim";
import { authState, AuthState } from "state/atoms";
import { Address } from "wallet/types/wallet";

import { styles } from "./token-swap-style";

//TODO remove necessary .filter((token) => token != erc20Tokens[selectedInputTokenIndex])

//Router contract address from uniswap v3
const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

type Props = {
  wallet: EthereumWallet;
  address: Address;
};

const TokenUniswapView = ({ wallet, address }: Props) => {
  const erc20TokensLocal = erc20Tokens.filter((token) => token.isToken != false);
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
    updateBalance(erc20TokensLocal[0]);
  }, []);

  type refreshProps = {
    inputIndex: number;
    inputValue: string;
    outputIndex: number;
  };
  const refreshSwapRouteTimer = (props: refreshProps) => {
    clearTimeout(timerRef.current);
    setLoadingSwapRoute(false);
    setSwapRouteErr(false);
    setSwapRoute(undefined);
    if (inputValue) {
      setLoadingSwapRoute(true);
      timerRef.current = setTimeout(
        () =>
          updateSwapRoute(
            erc20TokensLocal[props.inputIndex],
            erc20TokensLocal.filter((token) => token != erc20TokensLocal[props.inputIndex])[props.outputIndex],
            props.inputValue
          ),
        2000
      );
    }
  };

  const updateSelectedInputToken = (index: number) => {
    setSelectedInputTokenIndex(index);
    updateBalance(erc20TokensLocal[index]);
    refreshSwapRouteTimer({ inputIndex: index, inputValue: inputValue!, outputIndex: selectedOutputTokenIndex });
  };

  const [inputValue, setInputValue] = useState<string>();
  const timerRef = useRef<any>();
  const updateInputValue = (inputValue: string) => {
    setInputValue(inputValue);
    refreshSwapRouteTimer({
      inputIndex: selectedInputTokenIndex,
      inputValue: inputValue,
      outputIndex: selectedOutputTokenIndex,
    });
  };

  const updateSelectedOutputToken = (index: number) => {
    setSelectedOutputTokenIndex(index);
    refreshSwapRouteTimer({ inputIndex: selectedInputTokenIndex, inputValue: inputValue!, outputIndex: index });
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

  const [swapRoute, setSwapRoute] = useState<SwapRoute>();
  const [loadingSwapRoute, setLoadingSwapRoute] = useState<boolean>();
  const [swapRouteErr, setSwapRouteErr] = useState<boolean>(false);
  const updateSwapRoute = async (inputToken: ERC20Token, outputToken: ERC20Token, inputAmount: string) => {
    const inputAmountWei = ethers.utils.parseUnits(inputAmount, inputToken.decimals);
    try {
      const route = await findRouteExactInput(
        inputToken,
        outputToken,
        address.address,
        inputAmountWei.toString(),
        signer!.provider!
      );
      setSwapRoute(route);
    } catch (err) {
      console.log(err);
      setSwapRouteErr(true);
    }
    setLoadingSwapRoute(false);
  };

  const swapAlert = () => {
    if (!inputValue || !swapRoute) return;
    Alert.alert(
      "Confirm your swap",
      "You should get " +
        swapRoute.quote.toFixed() +
        " " +
        erc20TokensLocal.filter((token) => token != erc20TokensLocal[selectedInputTokenIndex])[selectedOutputTokenIndex]
          .symbol +
        " for " +
        inputValue +
        " " +
        erc20TokensLocal[selectedInputTokenIndex].symbol +
        " with fee " +
        swapRoute.estimatedGasUsed.toString() +
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
    if (!inputValue || !swapRoute) return;

    const inputAmountWei = ethers.utils.parseUnits(inputValue, erc20TokensLocal[selectedInputTokenIndex].decimals);

    //check if uniswap has allowance for enough value - else approve new amount
    const allowedAmount = await checkAllowance(
      erc20TokensLocal[selectedInputTokenIndex],
      address.address,
      signer!.provider!,
      V3_SWAP_ROUTER_ADDRESS
    );
    if (!allowedAmount.gte(inputAmountWei)) {
      if (
        !(await approveAmount(
          erc20TokensLocal[selectedInputTokenIndex],
          inputAmountWei.sub(allowedAmount),
          signer!,
          V3_SWAP_ROUTER_ADDRESS
        ))
      )
        console.error("Could not approve new amount for swapping");
    }

    try {
      const swapped = await swapWithRoute(swapRoute, address.address, signer!);
      Alert.alert(
        "Successfully swapped!",
        "You should get " + swapRoute.quote.toFixed() + " " + erc20TokensLocal[selectedOutputTokenIndex].symbol
      );
    } catch (err) {
      console.log(err);
      Alert.alert("Unable to swap", "Maybe the route was outdated.");
    }
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
          {erc20TokensLocal.map((token, index) => {
            return <Picker.Item key={token.name} label={token.name} value={index} />;
          })}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder={"0 " + erc20TokensLocal[selectedInputTokenIndex]?.symbol}
          onChangeText={(value) => updateInputValue(value)}
          value={inputValue}
        ></TextInput>
        <Text style={styles.availableValueText}>
          Available:{" "}
          {availableBalance &&
            !loadingBalance &&
            getBalanceFromEthereumTokenBalance(
              availableBalance,
              erc20TokensLocal[selectedInputTokenIndex]
            ).value.toString() +
              " " +
              erc20TokensLocal[selectedInputTokenIndex].symbol}
          {loadingBalance && <ActivityIndicator />}
        </Text>
      </View>
      {loadingSwapRoute ? <ActivityIndicator /> : <Text style={styles.arrowDown}>{"\u2193"}</Text>}
      <View style={styles.pickerArea}>
        <Text style={styles.pickerHeading}>To</Text>
        <Picker
          style={styles.tokenPicker}
          itemStyle={styles.tokenPickerItem}
          selectedValue={selectedOutputTokenIndex}
          onValueChange={(itemValue) => updateSelectedOutputToken(itemValue)}
        >
          {erc20TokensLocal
            .filter((token) => token != erc20TokensLocal[selectedInputTokenIndex])
            .map((token, index) => {
              return <Picker.Item key={token.name} label={token.name} value={index} />;
            })}
        </Picker>
        <TextInput
          editable={false}
          style={styles.input}
          value={
            (swapRoute ? swapRoute.quote.toFixed() : "?") +
            " " +
            erc20TokensLocal.filter((token) => token != erc20TokensLocal[selectedInputTokenIndex])[
              selectedOutputTokenIndex
            ]?.symbol
          }
        ></TextInput>
        {swapRouteErr && <Text style={styles.routeErrorText}>No route for this pair</Text>}
        {swapRoute && <Text style={styles.feesText}>{"Fees: " + swapRoute.estimatedGasUsed.toString() + " WEI"}</Text>}
      </View>
      <TouchableOpacity
        style={!inputValue || !swapRoute || swapRouteErr ? styles.actionButtonDisabled : styles.actionButton}
        disabled={!inputValue || !swapRoute || swapRouteErr}
        onPress={() => swapAlert()}
      >
        <Text style={styles.actionButtonText}>Swap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TokenUniswapView;
