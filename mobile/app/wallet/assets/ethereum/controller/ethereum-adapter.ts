import { importPublic, pubToAddress } from "ethereumjs-util";
import ec from "lib/elliptic";
import { AddressAndPublicKey } from "wallet/controller/adapter/blockchain-adapter";

export const publicKeyToEthereumAddress = (publicKey: string): AddressAndPublicKey => {
  const ecPair = ec.keyFromPublic([...Buffer.from(publicKey, "base64")].slice(23));

  const pubKeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");

  const ethPub = importPublic(pubKeyBuf);

  const address = pubToAddress(ethPub);

  return { address: `0x${address.toString("hex")}`, publicKey: ethPub.toString("base64") };
};
