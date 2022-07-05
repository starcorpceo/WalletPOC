// ToDo's
// derive not only from bitcoin
// derive several wallets

import Elliptic from "elliptic";
import { deriveBIP32, generateSecret, importSecret } from "lib/mpc";
import "shim";
import { IConstructor, IWallet, WalletConfig } from "./wallet";
const ec = new Elliptic.ec("secp256k1");

export const generateWalletFromSeed = async <T extends IWallet>(
  seed: string,
  Wallet: IConstructor<T>,
  pubKeyTransformer: PubKeyToWalletConfig
): Promise<T> => {
  console.log("generating wallet from seed " + seed.slice(0, 5), "...");

  const share = await importSecret(seed);

  return await derive(Wallet, pubKeyTransformer, share);
};

export const generateWallet = async <T extends IWallet>(
  Wallet: IConstructor<T>,
  pubKeyTransformer: PubKeyToWalletConfig
): Promise<T> => {
  console.log("generating new wallet...");
  const share = await generateSecret();
  return await derive(Wallet, pubKeyTransformer, share);
};

const derive = async <T extends IWallet>(
  Wallet: IConstructor<T>,
  pubKeyBufToWalletConfig: PubKeyToWalletConfig,
  share: string
): Promise<T> => {
  const pubKeyDER = await deriveBIP32(share);

  const ecPair = ec.keyFromPublic(pubKeyDER.slice(23));

  const pubkeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");

  return new Wallet(pubKeyBufToWalletConfig(pubkeyBuf));
};

export type PubKeyToWalletConfig = (publicKey: Buffer) => WalletConfig;
