const Network: "TEST" | "Main" = "TEST";

const isTestNet = Network === "TEST";

interface Config {
  IsTestNet: boolean;
  coinTypeIndex: string;
  chain: string;
}

export const config: Config = {
  IsTestNet: isTestNet,
  coinTypeIndex: isTestNet ? "1" : "60",
  chain: isTestNet ? "goerli" : "mainnet",
};
