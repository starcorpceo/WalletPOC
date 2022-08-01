import constants from "config/constants";
import React, { useCallback, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import {
  deriveMpcKeyShare,
  generateMPCKeyShareFromSeed,
} from "wallet/controller/generator";

import { User } from "api-types/user";
import { KeyShareType } from "shared/mpc";

type ImportWalletProps = {
  user: User;
};

const importSeed1: string =
  "982a490f7e3fe73233a54d4f2cd9030457bdf735c68d453a0d14d6679e5b33f4";

const ImportWallet = ({ user }: ImportWalletProps) => {
  const [seed, setSeed] = useState<string>(importSeed1);

  const setAuth = useSetRecoilState<AuthState>(authState);

  const importWallet = useCallback(async () => {
    const bip44MasterKeyShare = await generateMPCKeyShareFromSeed(seed, user);

    const purposeKeyShare = await deriveMpcKeyShare(
      bip44MasterKeyShare,
      user,
      constants.bip44PurposeIndex,
      true,
      KeyShareType.PURPOSE
    );

    //const xPub = await getXPubKey(purposeWallet.keyShare, "main");

    setAuth((auth: AuthState) => {
      return {
        ...auth,
        bip44MasterKeyShare,
        keyShares: [...auth.keyShares, purposeKeyShare],
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
