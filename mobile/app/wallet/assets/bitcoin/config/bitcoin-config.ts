import * as bitcoin from "der-bitcoinjs-lib";

const Network: "TEST" | "MAIN" = "TEST";

const isTestNet = Network === "TEST";

interface Config {
  BCNetwork: bitcoin.Network;
  IsTestNet: boolean;
  bip44BitcoinCoinType: string;
}

export const config: Config = {
  BCNetwork: isTestNet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  IsTestNet: isTestNet,
  bip44BitcoinCoinType: isTestNet ? "1" : "0",
};
