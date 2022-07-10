import { pubKeyTransformer } from "bitcoin/controller/bitcoinjs";
import { bitcoinWalletsState } from "bitcoin/state/atoms";
import React from "react";
import { Button } from "react-native";
import { useSetRecoilState } from "recoil";
import { generateWallet } from "wallet/generator";
import { User } from "../../../../api-types/user";

type GenerateWalletProps = {
  user: User;
};

const GenerateWallet = ({ user }: GenerateWalletProps) => {
  const setWallet = useSetRecoilState(bitcoinWalletsState);

  const startGenerate = async () => {
    const wallet = await generateWallet(user, pubKeyTransformer);

    setWallet((currentWallets) => [...currentWallets, wallet]);
  };

  return <Button onPress={startGenerate} title="Generate Wallet" />;
};

export default GenerateWallet;
