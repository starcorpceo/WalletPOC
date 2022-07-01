import { BitcoinWallet } from "bitcoin/controller/bitcoin-wallet";
import { pubKeyTransformer } from "bitcoin/controller/bitcoinjs";
import { btcWalletsState } from "bitcoin/state/atoms";
import React from "react";
import { Button } from "react-native";
import { useSetRecoilState } from "recoil";
import { generateWallet } from "wallet/generator";

const GenerateWallet = () => {
  const setWallet = useSetRecoilState(btcWalletsState);

  const startGenerate = async () => {
    const wallet = await generateWallet(BitcoinWallet, pubKeyTransformer);

    setWallet((currentWallets) => [...currentWallets, wallet]);
  };

  return <Button onPress={startGenerate} title="Generate Wallet" />;
};

export default GenerateWallet;
