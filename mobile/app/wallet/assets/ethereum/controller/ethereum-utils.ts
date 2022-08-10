import { importPublic, pubToAddress } from "ethereumjs-util";
import ec from "lib/elliptic";

export const publicKeyToEthereumAddress = (publicKey: string) => {
  const ecPair = ec.keyFromPublic([...Buffer.from(publicKey, "base64")].slice(23));

  const pubKeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");

  const ethPub = importPublic(pubKeyBuf);

  const address = pubToAddress(ethPub);

  return `0x${address.toString("hex")}`;
};
