import { Provider } from "@ethersproject/abstract-provider";
import "@ethersproject/shims";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import { AlphaRouter, SwapRoute } from "@uniswap/smart-order-router";
import { ERC20Token } from "ethereum/config/token-constants";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import { BigNumber, ethers } from "ethers";
import JSBI from "jsbi";

//Router contract address from uniswap v3
const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

//Factroy contract address from uniswap
const FACTORY_CONTRACT_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

/**
 * Find auto router uniswap route for tokens to swap
 * @param tokenFrom
 * @param tokenTo
 * @param myAddress
 * @param amount
 * @param provider
 * @returns
 */
export const findRouteExactInput = async (
  tokenFrom: ERC20Token,
  tokenTo: ERC20Token,
  myAddress: string,
  amount: string,
  provider: Provider
): Promise<SwapRoute> => {
  const TokenA = new Token(5, tokenFrom.contractAddress, tokenFrom.decimals, tokenFrom.symbol);
  const TokenB = new Token(5, tokenTo.contractAddress, tokenTo.decimals, tokenTo.symbol);

  const currencyAmount = CurrencyAmount.fromRawAmount(TokenA, JSBI.BigInt(amount));

  const router = new AlphaRouter({ chainId: 5, provider: provider as ethers.providers.JsonRpcProvider });

  const route = await router.route(currencyAmount, TokenB, TradeType.EXACT_INPUT, {
    recipient: myAddress,
    slippageTolerance: new Percent(5, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
  });

  if (!route) throw new Error("Could not create route object for swapping");

  return route;
};

/**
 * Swaps with data from route
 * !!amount have to be approved beforehand
 * @param route
 * @param address
 * @param signer
 * @returns
 */
export const swapWithRoute = async (route: SwapRoute, address: string, signer: MPCSigner) => {
  if (route.methodParameters) {
    const transaction = {
      data: route.methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: BigNumber.from(route.methodParameters.value),
      from: address,
      gasPrice: BigNumber.from(route.gasPriceWei),
    };
    return await signer.sendTransaction(transaction);
  }
};
