import { ERC20Token } from "ethereum/config/token-constants";
import { BigNumberish, ethers, BigNumber } from "ethers";
import { MPCSigner } from "../zksync/signer";
import { abi as ERC20ABI } from "@uniswap/v2-core/build/ERC20.json";
import { Provider } from "@ethersproject/abstract-provider";

/**
 * Approves amount of token to be used for swapping
 * Is neccessary so uniswap can use that amount for swapping (uses fees)
 * @param token token which value should be approved
 * @param amount amount to be approved
 * @param signer signer to be use for signing
 * @param contractAddress contract address for which the amount should be approved
 * @returns Promise<boolean> true if it succeeded
 */
export const approveAmount = async (
  token: ERC20Token,
  amount: BigNumberish,
  signer: MPCSigner,
  contractAddress: string
): Promise<boolean> => {
  const approvalResponse = await new ethers.Contract(token.contractAddress, ERC20ABI, signer).approve(
    contractAddress,
    amount.toString()
  );
  await approvalResponse.wait();
  if (approvalResponse) return true;
  else return false;
};

/**
 * Checks how much value is approved for token on this address
 * @param token
 * @param address
 * @param provider
 * @param contractAddress contract address for which the amount should be approved
 * @returns
 */
export const checkAllowance = async (
  token: ERC20Token,
  address: string,
  provider: Provider,
  contractAddress: string
): Promise<BigNumber> => {
  const allowanceResponce: BigNumber = await new ethers.Contract(token.contractAddress, ERC20ABI, provider).allowance(
    address,
    contractAddress
  );
  return allowanceResponce;
};
