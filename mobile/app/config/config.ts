import * as bitcoin from "der-bitcoinjs-lib";
import "shim";

const Network: "TEST" | "Main" = "TEST";

const isTestNet = Network === "TEST";

interface Config {
  BCNetwork: bitcoin.Network;
  IsTestNet: boolean;
}

export const config: Config = {
  BCNetwork: isTestNet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  IsTestNet: isTestNet,
};
