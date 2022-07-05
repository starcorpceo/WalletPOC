import { generateEcdsa } from "lib/mpc";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { authState } from "state/atoms";

const CreateWallet = () => {
  const { devicePublicKey, userId } = useRecoilValue(authState);

  const [keyPair, setKeyPair] = useState("");

  useEffect(() => {
    const createWallet = async () => {
      const mainKeyShare = await generateEcdsa(devicePublicKey, userId);

      setKeyPair(mainKeyShare);
    };

    createWallet();
  }, []);

  return (
    <View>
      <Text>This is your key share: {keyPair.slice(0, 23)}</Text>
    </View>
  );
};

export default CreateWallet;
