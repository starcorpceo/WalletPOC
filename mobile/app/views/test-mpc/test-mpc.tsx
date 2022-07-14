import { createGenericSecret, generateEcdsa, importSecret } from "lib/mpc";
import React, { useCallback, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { useRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { Wallet } from "../../api-types/wallet";
import { groupStyle } from "./style";
import TestMpcWallet from "./test-mpc-wallet";

const TestMpc = () => {
  const [secretToImport, setSecretToImport] = useState(
    "153649e88ae8337f53451d8d0f4e6fd7e1860620923fc04192c8abc2370b68dc"
  );

  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const { devicePublicKey, id: userId, wallets } = auth;

  const generateEcdsaCallback = useCallback(async () => {
    console.log("watt", auth);
    const newMainKeyShare = await generateEcdsa(devicePublicKey, userId);

    setAuth((current: AuthState) => {
      return {
        ...current,
        wallets: [
          ...current.wallets,
          {
            id: newMainKeyShare.serverShareId,
            share: newMainKeyShare.clientShare,
            genericSecret: null,
            parentWalletId: null,
          },
        ],
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
        wallets: [
          ...currentState.wallets,
          {
            id: importedSecret.serverShareId,
            genericSecret: importedSecret.clientShare,
            share: null,
            parentWalletId: null,
          },
        ],
      };
    });
  }, [secretToImport, devicePublicKey, userId]);

  return (
    <View>
      <View style={groupStyle}>
        <Button onPress={generateEcdsaCallback} title="Generate Ecdsa!" />
      </View>

      <View style={groupStyle}>
        <Button onPress={generateSecretCallback} title="Generate Secret!" />
      </View>

      <View style={groupStyle}>
        <Text>Import Secret:</Text>
        <TextInput value={secretToImport} />
        <Button onPress={importCallback} title="Import!" />
      </View>
      <ScrollView
        style={{ marginHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: wallets?.length * 130 }}
      >
        {wallets?.map((wallet: Wallet) => {
          return (
            <TestMpcWallet
              key={wallet.id}
              wallet={wallet}
              userId={userId}
              devicePublicKey={devicePublicKey}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TestMpc;
