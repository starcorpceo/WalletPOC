import { importPublic, pubToAddress } from "ethereumjs-util";
import { ethers } from "ethers";
import ec from "lib/elliptic";
import { AddressAndPublicKey } from "wallet/controller/adapter/blockchain-adapter";

export const publicKeyToEthereumAddress = (publicKey: string): AddressAndPublicKey => {
  const ecPair = ec.keyFromPublic([...Buffer.from(publicKey, "base64")].slice(23));

  const pubKeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");

  const ethPub = importPublic(pubKeyBuf);

  const address = ethers.utils.getAddress(pubToAddress(ethPub).toString("hex"));

  return { address: `${address}`, publicKey: ethPub.toString("base64") };
};
