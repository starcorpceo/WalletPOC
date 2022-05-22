import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-secure-encryption-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SecureEncryptionModule = NativeModules.SecureEncryptionModule
  ? NativeModules.SecureEncryptionModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function generateKeyPair(alias: String): Promise<any> {
  return SecureEncryptionModule.generateKeyPair(alias);
}

export function encrypt(
  clearText: String,
  publicKeyName: String
): Promise<any> {
  return SecureEncryptionModule.encrypt(clearText, publicKeyName);
}

export function decrypt(
  encryptedText: String,
  publicKeyName: String
): Promise<any> {
  return SecureEncryptionModule.encrypt(encryptedText, publicKeyName);
}
