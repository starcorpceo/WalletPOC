import React from "react";
import { Button } from "react-native";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { generateAccountWallet } from "wallet/controller/generator";
import { User } from "../../../api-types/user";

type GenerateWalletProps = {
  user: User;
};

const GenerateWallet = ({ user }: GenerateWalletProps) => {
  const setAuth = useSetRecoilState(authState);

  const startGenerate = async () => {
    const wallet = await generateAccountWallet(user);

    setAuth((auth: AuthState) => {
      return { ...auth, masterWallet: wallet };
    });
  };

  return <Button onPress={startGenerate} title="Generate Wallet" />;
};

export default GenerateWallet;
