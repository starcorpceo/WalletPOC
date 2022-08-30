const Network: "TEST" | "Main" = "TEST";

const isTestNet = Network === "TEST";

interface Config {
  IsTestNet: boolean;
  coinTypeIndex: string;
  chain: string;
  chainId: number;
}

export const config: Config = {
  IsTestNet: isTestNet,
  coinTypeIndex: isTestNet ? "1" : "60",
  chain: isTestNet ? "goerli" : "mainnet",
  chainId: isTestNet ? 5 : 1,
};

export const alchemyProviderKey = "ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0";
