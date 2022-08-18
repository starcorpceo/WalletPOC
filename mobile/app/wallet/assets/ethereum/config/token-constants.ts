import { config } from "./ethereum-config";

//created VEST Tether with remix -> to receive funds -> mathias chrome metamask wallet have full funds
const erc20GoerliTokens: ERC20Token[] = [
  { name: "USDC", symbol: "USDC", contractAddress: "0x07865c6e87b9f70255377e024ace6630c1eaa37f", decimals: 6 },
  { name: "Vest Tether", symbol: "VESTT", contractAddress: "0x407a2069455a8D16FFad985F1c7500B1EE8e5536", decimals: 18 },
];

const erc20MainnetTokens: ERC20Token[] = [];

export const findContractAddressBySymbol = (searchSymbol: string): ERC20Token | undefined => {
  return config.IsTestNet
    ? erc20GoerliTokens.find((erc20Token) => erc20Token.symbol === searchSymbol)
    : erc20MainnetTokens.find((erc20Token) => erc20Token.symbol === searchSymbol);
};

export const erc20Tokens = config.IsTestNet ? erc20GoerliTokens : erc20MainnetTokens;

export interface ERC20Token {
  name: string;
  symbol: string;
  contractAddress: string;
  decimals: number;
}
