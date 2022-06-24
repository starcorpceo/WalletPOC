import * as LocalAuthentication from "expo-local-authentication";
import { generateKeyPair } from "react-native-secure-encryption-module";
import constants from "../config/constants";

export const createDeviceKey = async (): Promise<string> => {
  const { success } = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate in WalletPOC",
    cancelLabel: "cancel",
  });

  if (!success) {
    // Show snackbar here or similar
    throw new Error("Authentication not successful");
  }

  return await generateKeyPair(constants.deviceKeyName);
};
