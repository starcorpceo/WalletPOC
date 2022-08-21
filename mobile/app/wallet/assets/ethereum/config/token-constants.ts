import { config } from "./ethereum-config";

//created VEST Tether with remix -> to receive funds -> mathias chrome metamask wallet have full funds
const erc20GoerliTokens: ERC20Token[] = [
  {
    name: "Wrapped Ether",
    symbol: "wETH",
    contractAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    decimals: 18,
  },
  { name: "USDC", symbol: "USDC", contractAddress: "0x07865c6e87b9f70255377e024ace6630c1eaa37f", decimals: 6 },
  { name: "Vest Tether", symbol: "VESTT", contractAddress: "0x407a2069455a8D16FFad985F1c7500B1EE8e5536", decimals: 18 },
  { name: "Uniswap USDC", symbol: "USDC", contractAddress: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C", decimals: 6 },
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
