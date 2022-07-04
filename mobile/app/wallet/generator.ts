// ToDo's
// derive not only from bitcoin
// derive several wallets

import Elliptic from "elliptic";
import "shim";
import { deriveBIP32, generateSecret, importSecret } from "./mpc";
import { IConstructor, IWallet, WalletConfig } from "./wallet";
const ec = new Elliptic.ec("secp256k1");

export const generateWalletFromSeed = async <T extends IWallet>(
  seed: string,
  Wallet: IConstructor<T>,
  pubKeyTransformer: PubKeyToWalletConfig
): Promise<T> => {
  console.log("generating wallet from seed " + seed.slice(0, 5), "...");

  await importSecret(seed, (seedShare: string) => {
    // TODO: Dont depend on cpp magic and actually handle seedShare

    console.log(
      "Seed share",
      Buffer.from(seedShare).toString("hex").slice(0, 5) + "..."
    );
  });

  return await derive(Wallet, pubKeyTransformer);
};

export const generateWallet = async <T extends IWallet>(
  Wallet: IConstructor<T>,
  pubKeyTransformer: PubKeyToWalletConfig
): Promise<T> => {
  console.log("generating new wallet...");
  await generateSecret((seedShare: string) => {
    // TODO: Dont depend on cpp magic and actually handle seedShare

    console.log(
      "Seed share",
      Buffer.from(seedShare).toString("hex").slice(0, 5) + "..."
    );
  });
  return await derive(Wallet, pubKeyTransformer);
};

const derive = async <T extends IWallet>(
  Wallet: IConstructor<T>,
  pubKeyBufToWalletConfig: PubKeyToWalletConfig
): Promise<T> => {
  const pubKeyDER = await deriveBIP32();

  const ecPair = ec.keyFromPublic(pubKeyDER.slice(23));

  const pubkeyBuf = Buffer.from(ecPair.getPublic().encode("hex", false), "hex");

  return new Wallet(pubKeyBufToWalletConfig(pubkeyBuf));
};

export type PubKeyToWalletConfig = (publicKey: Buffer) => WalletConfig;
