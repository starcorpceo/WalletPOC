import "@ethersproject/shims";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import { Pool } from "@uniswap/v3-sdk";
import { BigNumber, ethers } from "ethers";

import { AlphaRouter } from "@uniswap/smart-order-router";
import { abi as ERC20ABI } from "@uniswap/v2-core/build/ERC20.json";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import { EthereumWallet } from "ethereum/types/ethereum";
import JSBI from "jsbi";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import "shim";
import { authState, AuthState } from "state/atoms";

const {
  abi: UniswapV3Factory,
} = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");

type Props = NativeStackScreenProps<NavigationRoutes, "TokenUniswapScreen">;

// const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8"; - only mainnet

const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const usdcAddress = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C";

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

interface Immutables {
  factory: string;
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: ethers.BigNumber;
}

interface State {
  liquidity: ethers.BigNumber;
  sqrtPriceX96: ethers.BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}

const TokenUniswapScreen = ({ route }: Props) => {
  const [wallet, setWallet] = useState<EthereumWallet>(route.params.wallet);

  const MY_ADDRESS = route.params.wallet.external.addresses[0].address;
  const provider = new ethers.providers.AlchemyProvider("goerli", "ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0");

  const [signer, setSigner] = useState<MPCSigner>();
  const user = useRecoilValue<AuthState>(authState);
  const [service] = useState(new EthereumService("TEST"));
  useEffect(() => {
    setSigner(
      new MPCSigner(wallet.external.addresses[0], user).connect(
        new ethers.providers.AlchemyProvider("goerli", "ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0")
      )
    );
  }, []);

  const test = async () => {
    const factoryContract = new ethers.Contract(
      "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      UniswapV3Factory,
      provider
    );

    //const quoterAddress = await factoryContract.
    console.log("factory contract: ", factoryContract);

    const poolAddress = await factoryContract.getPool(wethAddress, usdcAddress, 500);

    console.log(poolAddress);

    const poolContract: ethers.Contract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);

    const [immutables, state] = await Promise.all([getPoolImmutables(poolContract), getPoolState(poolContract)]);

    const TokenA = new Token(5, immutables.token0, 6);

    const TokenB = new Token(5, immutables.token1, 18);

    const poolExample = new Pool(
      TokenA,
      TokenB,
      immutables.fee,
      state.sqrtPriceX96.toString(),
      state.liquidity.toString(),
      state.tick
    );

    console.log(poolExample);

    const token0Price = poolExample.token0Price;
    console.log("Token 0 price: ", token0Price);

    const token1Price = poolExample.token1Price;
    console.log("Token 1 price: ", token1Price);

    const quoterContract = new ethers.Contract("0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6", QuoterABI, provider);
    // https://github.com/Uniswap/v3-periphery/blob/main/deploys.md

    // const amountIn = 1;

    // const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    //   immutables.token0,
    //   immutables.token1,
    //   immutables.fee,
    //   amountIn.toString(),
    //   0
    // );

    // const swapRoute = new Route([poolExample], TokenB, TokenA);

    // const uncheckedTradeExample = await Trade.createUncheckedTrade({
    //   route: swapRoute,
    //   inputAmount: CurrencyAmount.fromRawAmount(TokenB, amountIn.toString()),
    //   outputAmount: CurrencyAmount.fromRawAmount(TokenA, quotedAmountOut.toString()),
    //   tradeType: TradeType.EXACT_INPUT,
    // });

    // console.log("The quoted amount out is", quotedAmountOut.toString());
    // console.log("The unchecked trade object is", uncheckedTradeExample);

    const router = new AlphaRouter({ chainId: 5, provider: provider });
    console.log("signer?: ", signer?._isSigner);
    //console.log("signer send: " , await signer?.sendTransaction("test")
    console.log("provider from signer: ", signer?.provider?._isProvider);
    const typedValueParsed = "1000000000000000";
    const wethAmount = CurrencyAmount.fromRawAmount(TokenA, JSBI.BigInt(typedValueParsed));

    console.log("between");

    const tokenToSendContract = new ethers.Contract(wethAddress, ERC20ABI, signer);

    //Only used if approved amount is too low
    // const approvalResponse = await tokenToSendContract.approve(V3_SWAP_ROUTER_ADDRESS, "100000000000000000");
    // console.log("approval:", approvalResponse);

    const tokenToReceiveContract = new ethers.Contract(usdcAddress, ERC20ABI, signer);

    const allowanceResponce = await tokenToSendContract.allowance(MY_ADDRESS, V3_SWAP_ROUTER_ADDRESS);
    console.log("allowanceToken wEth: ", allowanceResponce);

    const allowanceResponceUSDC = await tokenToReceiveContract.allowance(MY_ADDRESS, V3_SWAP_ROUTER_ADDRESS);
    console.log("allowanceToken USDC: ", allowanceResponceUSDC);

    // const approvalResponse2 = await tokenToReceiveContract.approve(V3_SWAP_ROUTER_ADDRESS, "100000000000000000");
    // console.log("approval2:", approvalResponse2);

    console.log("amount to send: ", wethAmount);

    const route = await router.route(wethAmount, TokenB, TradeType.EXACT_INPUT, {
      recipient: MY_ADDRESS,
      slippageTolerance: new Percent(5, 100),
      deadline: Math.floor(Date.now() / 1000 + 1800),
    });
    console.log("after");
    if (!route) return;
    console.log(`Quote Exact In: ${route.quote.toFixed(10)}`);
    console.log(`Gas Adjusted Quote In: ${route.quoteGasAdjusted.toFixed(10)}`);
    console.log(`Gas Used USD: ${route.estimatedGasUsedUSD.toFixed(8)}`);
    console.log("whole route: ", route);

    const gasPrice = await service.getFees(EthereumProviderEnum.ALCHEMY);
    const transactionCount = await service.getTransactionCount(MY_ADDRESS, EthereumProviderEnum.ALCHEMY);

    if (!route.methodParameters) return;
    const transaction = {
      data: route.methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: BigNumber.from(route.methodParameters.value),
      from: MY_ADDRESS,
      gasPrice: BigNumber.from(route.gasPriceWei),
      gasLimit: 150000,
      chainId: 5,
      nonce: transactionCount,
    };

    console.log("Transaction");
    console.log(transaction);

    if (!signer) return;
    const rawTransaction = await signer.signTransaction(transaction);
    console.log("final: ", rawTransaction);
    try {
      const result = await service.sendRawTransaction(rawTransaction, EthereumProviderEnum.ALCHEMY);
      Alert.alert("Successfully sent.");
    } catch (err) {
      console.log(err);
      Alert.alert("Unable to broadcast transaction");
    }
  };

  async function getPoolImmutables(poolContract: ethers.Contract) {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ]);

    const immutables: Immutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    };
    return immutables;
  }

  async function getPoolState(poolContract: ethers.Contract) {
    const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()]);

    const PoolState: State = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    };

    return PoolState;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Swap with Uniswap</Text>
      <Button title="test" onPress={test} />
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
});

export default TokenUniswapScreen;
