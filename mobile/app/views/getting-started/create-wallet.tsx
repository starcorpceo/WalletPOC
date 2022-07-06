import constants from "config/constants";
import { generateEcdsa } from "lib/mpc";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { deleteKeyPair } from "react-native-secure-encryption-module";
import { useRecoilState } from "recoil";
import { AuthState, authState, initialAuthState } from "state/atoms";

const CreateWallet = () => {
  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const { devicePublicKey, userId, mainKeyShare } = auth;

  useEffect(() => {
    const createWallet = async () => {
      if (mainKeyShare && mainKeyShare !== "") return;

      const newMainKeyShare = await generateEcdsa(devicePublicKey, userId);

      console.log("new share", newMainKeyShare);
      setAuth((currentState: AuthState) => {
        return {
          ...currentState,
          mainKeyShare: newMainKeyShare,
        };
      });
    };

    createWallet();
  }, []);

  return (
    <View>
      <Text>This is your key share: {mainKeyShare?.slice(0, 23)}</Text>

      <Button
        onPress={() => {
          setAuth((_: AuthState) => initialAuthState);
          deleteKeyPair(constants.deviceKeyName);
        }}
        title="Reset Local State"
      />
    </View>
  );
};

export default CreateWallet;
