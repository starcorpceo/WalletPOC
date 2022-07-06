import { createGenericSecret, generateEcdsa } from "lib/mpc";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";

const CreateWallet = () => {
  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const { devicePublicKey, userId, mainKeyShare, genericSecret } = auth;

  useEffect(() => {
    const createWallet = async () => {
      if (genericSecret && genericSecret !== "") return;

      const newMainKeyShare = await generateEcdsa(devicePublicKey, userId);

      const newGenericSecret = await createGenericSecret(
        devicePublicKey,
        userId
      );

      setAuth((currentState: AuthState) => {
        return {
          ...currentState,
          mainKeyShare: newMainKeyShare,
          genericSecret: newGenericSecret,
        };
      });
    };

    createWallet();
  }, []);

  return (
    <View>
      <Text>This is your key share: {mainKeyShare?.slice(0, 23)}</Text>
      <Text>This is your generic Secret: {genericSecret?.slice(0, 23)}</Text>
    </View>
  );
};

export default CreateWallet;
