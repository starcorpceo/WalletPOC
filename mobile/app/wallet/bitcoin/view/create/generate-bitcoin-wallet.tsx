import { pubKeyTransformer } from "bitcoin/controller/bitcoinjs";
import { bitcoinWalletsState } from "bitcoin/state/atoms";
import React from "react";
import { Button } from "react-native";
import { useSetRecoilState } from "recoil";
import { BitcoinWallet } from "wallet/bitcoin";
import { generateCryptoWallet } from "wallet/controller/generator";
import { User } from "../../../../api-types/user";

type GenerateWalletProps = {
  user: User;
};

const GenerateBitcoinWallet = ({ user }: GenerateWalletProps) => {
  const setWallet = useSetRecoilState(bitcoinWalletsState);

  const startGenerate = async () => {
    const wallet = await generateCryptoWallet(user, pubKeyTransformer);

    setWallet((currentWallets: BitcoinWallet[]) => [...currentWallets, wallet]);
  };

  return <Button onPress={startGenerate} title="Generate Wallet" />;
};

export default GenerateBitcoinWallet;
