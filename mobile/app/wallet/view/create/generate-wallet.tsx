import constants from "config/constants";
import React, { useCallback } from "react";
import { Button } from "react-native";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import {
  deriveToMpcWallet,
  generateMpcWallet,
} from "wallet/controller/generator";
import { User } from "../../../api-types/user";

type GenerateWalletProps = {
  user: User;
};

const GenerateWallet = ({ user }: GenerateWalletProps) => {
  const setAuth = useSetRecoilState(authState);

  const startGenerate = useCallback(async () => {
    const bip44MasterWallet = await generateMpcWallet(user);

    const purposeWallet = await deriveToMpcWallet(
      bip44MasterWallet,
      user,
      constants.bip44PurposeIndex,
      true
    );

    setAuth((auth: AuthState) => {
      return {
        ...auth,
        bip44MasterWallet,
        wallets: [...auth.wallets, purposeWallet],
      };
    });
  }, [setAuth, user]);

  return <Button onPress={startGenerate} title="Generate Wallet" />;
};

export default GenerateWallet;
