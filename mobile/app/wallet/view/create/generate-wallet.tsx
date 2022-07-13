import constants from "config/constants";
import React from "react";
import { Button } from "react-native";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { generateMpcWallet } from "wallet/controller/generator";
import { User } from "../../../api-types/user";

type GenerateWalletProps = {
  user: User;
};

const GenerateWallet = ({ user }: GenerateWalletProps) => {
  const setAuth = useSetRecoilState(authState);

  const startGenerate = async () => {
    const bip44MasterWallet = await generateMpcWallet(
      user,
      constants.bip44MasterIndex
    );

    const bip44PurposeWallet = await generateMpcWallet(
      user,
      constants.bip44PurposeIndex
    );

    setAuth((auth: AuthState) => {
      return { ...auth, bip44MasterWallet, bip44PurposeWallet };
    });
  };

  return <Button onPress={startGenerate} title="Generate Wallet" />;
};

export default GenerateWallet;
