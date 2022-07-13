import constants from "config/constants";
import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import {
  generateMpcWallet,
  generateMpcWalletFromSeed,
} from "wallet/controller/generator";
import { User } from "../../../api-types/user";

type ImportWalletProps = {
  user: User;
};

const importSeed: string =
  "153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc";

const ImportWallet = ({ user }: ImportWalletProps) => {
  const [seed, setSeed] = useState<string>(importSeed);

  const setAuth = useSetRecoilState(authState);

  const importWallet = async () => {
    const masterWallet = await generateMpcWalletFromSeed(seed, user);

    const bip44Wallet = await generateMpcWallet(
      user,
      constants.bip44PurposeIndex
    );

    setAuth((auth: AuthState) => {
      return {
        ...auth,
        masterWallet,
        bip44Wallet,
      };
    });
  };

  return (
    <View style={{ padding: 4 }}>
      <TextInput
        onChangeText={setSeed}
        value={seed}
        style={{ backgroundColor: "white", padding: 4 }}
      />
      <Button onPress={importWallet} title="Import Wallet" />
    </View>
  );
};

export default ImportWallet;
