import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-blockchain-crypto-mpc' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const BlockchainCryptoMpc = NativeModules.BlockchainCryptoMpc
  ? NativeModules.BlockchainCryptoMpc
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function initGenerateGenericSecret(): Promise<boolean> {
  return BlockchainCryptoMpc.initGenerateGenericSecret();
}

export function importGenericSecret(secret: number[]): Promise<boolean> {
  return BlockchainCryptoMpc.importGenericSecret(secret);
}

export function initDeriveBIP32(): Promise<boolean> {
  return BlockchainCryptoMpc.initDeriveBIP32();
}

/*export function initBackupEcdsaKey(): Promise<boolean> {
  return BlockchainCryptoMpc.initBackupEcdsaKey();
}*/

/*export function initRefreshKey(): Promise<boolean> {
  return BlockchainCryptoMpc.initRefreshKey();
}*/

export function initGenerateEcdsaKey(): Promise<boolean> {
  return BlockchainCryptoMpc.initGenerateEcdsaKey();
}

export function initSignEcdsa(message: number[]): Promise<number[]> {
  return BlockchainCryptoMpc.initSignEcdsa(message);
}

export function step(messageIn: number[] | null): Promise<number[]> {
  console.log("in step");
  return BlockchainCryptoMpc.step(messageIn);
}

export function getPublicKey(): Promise<number[]> {
  return BlockchainCryptoMpc.getPublicKey();
}

export function getSignature(): Promise<number[]> {
  return BlockchainCryptoMpc.getSignature();
}

export function verifySignature(
  message: number[],
  signature: number[]
): Promise<boolean> {
  return BlockchainCryptoMpc.verifySignature(message, signature);
}

export function getSeedShare(): Promise<number[]> {
  return BlockchainCryptoMpc.getShare();
}
