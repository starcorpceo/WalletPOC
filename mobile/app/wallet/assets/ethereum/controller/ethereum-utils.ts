import { ERC20Token } from "ethereum/config/token-constants";
import { EthereumBalance, EthereumTokenBalance } from "packages/blockchain-api-client/src/blockchains/ethereum/types";

export const weiToEth = (wei: number): number => wei / 1000000000000000000;

export const weiToGwei = (wei: number): number => wei / 1000000000;

export const ethToGwei = (eth: number): number => eth * 1000000000;

export const gWeiToWei = (gWei: number): number => gWei * 1000000000;

export const gWeiToEth = (gWei: number): number => gWei / 1000000000;

export const getBalanceFromEthereumTokenBalance = (
  ethereumBalance: EthereumTokenBalance,
  token: ERC20Token
): EthereumBalance => {
  return { value: Number.parseInt(ethereumBalance.tokenBalance, 16) / 10 ** token.decimals };
};
