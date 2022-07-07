import {
  createGenericSecret,
  deriveBIP32,
  generateEcdsa,
  importSecret,
} from "lib/mpc";
import React, { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { getResultDeriveBIP32 } from "react-native-blockchain-crypto-mpc";
import { useRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";

const CreateWallet = () => {
  const [secretToImport, setSecretToImport] = useState(
    "153649e88ae8337f53451d8d0f4e6fd7e1860620923fc04192c8abc2370b68dc"
  );

  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const { devicePublicKey, userId, mainKeyShare, genericSecret } = auth;

  const generateEcdsaCallback = useCallback(async () => {
    const newMainKeyShare = await generateEcdsa(devicePublicKey, userId);
    console.log("this new generic will go in store", newMainKeyShare);

    setAuth((currentState: AuthState) => {
      return {
        ...currentState,
        mainKeyShare: newMainKeyShare,
      };
    });
  }, [devicePublicKey, userId, setAuth]);

  const generateSecretCallback = useCallback(async () => {
    const newGenericSecret = await createGenericSecret(devicePublicKey, userId);
    console.log("this will go in store", newGenericSecret);

    setAuth((currentState: AuthState) => {
      return {
        ...currentState,
        genericSecret: newGenericSecret,
      };
    });
  }, [devicePublicKey, userId, setAuth]);

  const importCallback = useCallback(async () => {
    const importedSecret = await importSecret(
      devicePublicKey,
      userId,
      secretToImport
    );

    setAuth((currentState: AuthState) => {
      return {
        ...currentState,
        genericSecret: importedSecret,
      };
    });
  }, [secretToImport, devicePublicKey, userId]);

  const deriveCallback = useCallback(async () => {
    const context = await deriveBIP32(
      devicePublicKey,
      userId,
      genericSecret.serverShareId,
      genericSecret.clientShare
    );

    const derivedShare = await getResultDeriveBIP32(context.clientContext);

    setAuth((current) => {
      return {
        ...current,
        mainKeyShare: {
          serverShareId: context.serverShareId,
          clientShare: derivedShare,
        },
      };
    });
  }, [genericSecret, userId, setAuth, devicePublicKey]);

  return (
    <View>
      <View style={groupStyle}>
        <Text>
          This is your key share: {mainKeyShare.clientShare.slice(0, 23)}
        </Text>
        <Button onPress={generateEcdsaCallback} title="Generate!" />
      </View>
      <View style={groupStyle}>
        <Text>
          This is your generic Secret: {genericSecret.clientShare.slice(0, 23)}
        </Text>
        <Button onPress={generateSecretCallback} title="Generate!" />
      </View>

      <View style={groupStyle}>
        <Text>Import Secret:</Text>
        <TextInput value={secretToImport} />
        <Button onPress={importCallback} title="Import!" />
      </View>

      <View style={groupStyle}>
        <Button title="Derive from generic Secret" onPress={deriveCallback} />
      </View>
    </View>
  );
};

const groupStyle = {
  borderBottomColor: "black",
  borderBottomWidth: StyleSheet.hairlineWidth,
  paddingBottom: 10,
  marginBottom: 10,
};

export default CreateWallet;
