import {
  createGenericSecret,
  deriveBIP32,
  generateEcdsa,
  importSecret,
  signEcdsa,
} from "lib/mpc";
import React, { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  getResultDeriveBIP32,
  verifySignature,
} from "react-native-blockchain-crypto-mpc";
import { useRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";

const TestMpc = () => {
  const [secretToImport, setSecretToImport] = useState(
    "153649e88ae8337f53451d8d0f4e6fd7e1860620923fc04192c8abc2370b68dc"
  );

  const [messageToSign, setMessageToSign] = useState("Sign me please");

  const [signature, setSignature] = useState("");
  const [signOK, setSignOK] = useState<boolean>();

  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const { devicePublicKey, userId, mainKeyShare, genericSecret } = auth;

  const generateEcdsaCallback = useCallback(async () => {
    const newMainKeyShare = await generateEcdsa(devicePublicKey, userId);

    setAuth((currentState: AuthState) => {
      return {
        ...currentState,
        mainKeyShare: newMainKeyShare,
      };
    });
  }, [devicePublicKey, userId, setAuth]);

  const generateSecretCallback = useCallback(async () => {
    const newGenericSecret = await createGenericSecret(devicePublicKey, userId);

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

  const signCallback = useCallback(async () => {
    const signature = await signEcdsa(
      devicePublicKey,
      userId,
      mainKeyShare.serverShareId,
      mainKeyShare.clientShare,
      messageToSign
    );

    setSignature(signature);
  }, [mainKeyShare, messageToSign, userId, setSignature, devicePublicKey]);

  const verifyCallback = useCallback(async () => {
    const ok = await verifySignature(
      messageToSign,
      signature,
      mainKeyShare.clientShare
    );

    setSignOK(ok);
  }, [messageToSign, signature, mainKeyShare, setSignOK]);

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

      <View style={groupStyle}>
        <Text>Sign "{messageToSign}" with current Key Share</Text>
        <Button title="Sign!" onPress={signCallback} />
        <Text>Signature: {signature}</Text>
        <Button title="Verify!" onPress={verifyCallback} />
        <Text>OK: {`${signOK}`}</Text>
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

export default TestMpc;
