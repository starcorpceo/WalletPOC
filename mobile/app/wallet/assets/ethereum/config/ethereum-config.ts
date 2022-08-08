const Network: "TEST" | "Main" = "TEST";

const isTestNet = Network === "TEST";

interface Config {
  IsTestNet: boolean;
  coinTypeIndex: string;
}

export const config: Config = {
  IsTestNet: isTestNet,
  coinTypeIndex: isTestNet ? "1" : "60",
};
