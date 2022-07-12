import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { generateAccountWalletFromSeed } from "wallet/controller/generator";
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
    const wallet = await generateAccountWalletFromSeed(seed, user);

    setAuth((auth: AuthState) => {
      return {
        ...auth,
        masterWallet: wallet,
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
