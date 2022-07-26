import constants from "config/constants";
import React, { useCallback, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { getXPubKey } from "react-native-blockchain-crypto-mpc";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import {
  deriveToMpcWallet,
  generateMpcWalletFromSeed,
} from "wallet/controller/generator";
import { User } from "../../../api-types/user";

type ImportWalletProps = {
  user: User;
};

const importSeed1: string =
  "982a490f7e3fe73233a54d4f2cd9030457bdf735c68d453a0d14d6679e5b33f4";

const ImportWallet = ({ user }: ImportWalletProps) => {
  const [seed, setSeed] = useState<string>(importSeed1);

  const setAuth = useSetRecoilState(authState);

  const importWallet = useCallback(async () => {
    const bip44MasterWallet = await generateMpcWalletFromSeed(seed, user);

    const purposeWallet = await deriveToMpcWallet(
      bip44MasterWallet,
      user,
      constants.bip44PurposeIndex,
      true
    );

    const xPub = await getXPubKey(purposeWallet.keyShare, "main");

    setAuth((auth: AuthState) => {
      return {
        ...auth,
        bip44MasterWallet,
        xPub,
        wallets: [...auth.wallets, purposeWallet],
      };
    });
  }, [setAuth, seed, user]);

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
