import "@ethersproject/shims";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { AlphaRouter, SwapRoute } from "@uniswap/smart-order-router";
import { abi as ERC20ABI } from "@uniswap/v2-core/build/ERC20.json";
import { ERC20Token } from "ethereum/config/token-constants";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import JSBI from "jsbi";
import "shim";

//Router contract address from uniswap v3
const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

//Factroy contract address from uniswap
const FACTORY_CONTRACT_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

/**
 * Approves amount of token to be used for swapping
 * Is neccessary so uniswap can use that amount for swapping (uses fees)
 * @param token token which value should be approved
 * @param amount amount to be approved
 * @param signer signer to be use for signing
 * @returns Promise<boolean> true if it succeeded
 */
export const approveAmount = async (token: ERC20Token, amount: BigNumberish, signer: MPCSigner): Promise<boolean> => {
  const approvalResponse = await new ethers.Contract(token.contractAddress, ERC20ABI, signer).approve(
    V3_SWAP_ROUTER_ADDRESS,
    amount.toString()
  );
  console.log("Approved new Amount");
  if (approvalResponse) return true;
  else return false;
};

/**
 * Checks how much value is approved for token on this address
 * @param token
 * @param address
 * @param provider
 * @returns
 */
export const checkAllowance = async (token: ERC20Token, address: string, provider: Provider): Promise<BigNumber> => {
  const allowanceResponce: BigNumber = await new ethers.Contract(token.contractAddress, ERC20ABI, provider).allowance(
    address,
    V3_SWAP_ROUTER_ADDRESS
  );
  return allowanceResponce;
};

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
