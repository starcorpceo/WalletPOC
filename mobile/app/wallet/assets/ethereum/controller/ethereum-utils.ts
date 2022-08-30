import { Signature, SignatureLike } from "@ethersproject/bytes";
import { ERC20Token } from "ethereum/config/token-constants";
import { PolygonERC20Token } from "ethereum/polygon/config/tokens";
import { BigNumber, ethers } from "ethers";
import { EthereumBalance, EthereumTokenBalance } from "packages/blockchain-api-client/src/blockchains/ethereum/types";

export const weiToEth = (wei: number): number => wei / 1000000000000000000;

export const weiToGwei = (wei: number): number => wei / 1000000000;

export const ethToGwei = (eth: number): number => eth * 1000000000;

export const gWeiToWei = (gWei: number): number => gWei * 1000000000;

export const gWeiToEth = (gWei: number): number => gWei / 1000000000;

export const weiToEthBigNum = (gWei: string | number): BigNumber => BigNumber.from(gWei).div("1000000000000000000");

export const gWeiToEthBigNum = (gWei: string): BigNumber => BigNumber.from(gWei).div("1000000000");

export const gWeiToWeiBigNum = (gWei: string): BigNumber => BigNumber.from(gWei).mul("1000000000");

export const ethToWei = (eth: number): BigNumber => BigNumber.from(eth).mul("1000000000000000000");

export const getBalanceFromEthereumTokenBalance = (
  ethereumBalance: EthereumTokenBalance,
  token: ERC20Token | PolygonERC20Token
): EthereumBalance => {
  return { value: Number.parseInt(ethereumBalance.tokenBalance, 16) / 10 ** token.decimals };
};

/**
 * Workaround to fix a problem in unbound-crypto-mpc
 *
 * @param signature Signature with recoveryParam: 0
 * @param msgHash Message before signing
 * @param address Address we are expecting
 * @returns Recovery Code that leads from the Signature to the correct Public Key / Address
 */
export const getSignatureWithRecoveryCode = (
  signature: SignatureLike,
  msgHash: Buffer,
  address: string
): SignatureLike => {
  const recoveredAddress = ethers.utils.recoverAddress(msgHash, signature);

  if (recoveredAddress === address) return signature;

  return { ...(signature as Signature), recoveryParam: 1 };
};
