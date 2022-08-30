import { config } from "ethereum/config/ethereum-config";
import { ERC20Token } from "ethereum/config/token-constants";

export interface PolygonERC20Token extends Omit<ERC20Token, "contractAddress" | "isToken"> {
  ethereumAddress: string;
  polygonAddress: string;
}
export const etherAddress = "0";

const main: PolygonERC20Token[] = [
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    polygonAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    ethereumAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
  },
  {
    name: "USDC",
    symbol: "USDC",
    polygonAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    ethereumAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 18,
  },
  {
    name: "Matic Token",
    symbol: "MATIC",
    polygonAddress: "0x0000000000000000000000000000000000001010",
    ethereumAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    decimals: 18,
  },
];

const test: PolygonERC20Token[] = [
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    polygonAddress: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
    ethereumAddress: "0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc",
    decimals: 18,
  },
  {
    name: "Test ERC20",
    symbol: "TERC20",
    polygonAddress: "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
    ethereumAddress: "0x655F2166b0709cd575202630952D71E2bB0d61Af",
    decimals: 18,
  },
  {
    name: "Matic Token",
    symbol: "MATIC",
    polygonAddress: "0x0000000000000000000000000000000000001010",
    ethereumAddress: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
    decimals: 18,
  },
];

export const ethereum = {
  name: "Ether",
  symbol: "ETH",
  polygonAddress: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
  ethereumAddress: etherAddress,
  decimals: 18,
};

export const erc20Tokens = config.IsTestNet ? test : main;
