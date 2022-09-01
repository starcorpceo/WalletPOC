import { config } from "ethereum/config/ethereum-config";

const mainProxyAddress = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
const testProxyAddress = "0xb5505a6d998549090530911180f38aC5130101c6";

export const proxyAddress = config.IsTestNet ? testProxyAddress : mainProxyAddress;
