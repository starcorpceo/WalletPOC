import { BitcoinWallet } from "bitcoin/controller/bitcoin-wallet";
import { pubKeyTransformer } from "bitcoin/controller/bitcoinjs";
import { btcWalletsState } from "bitcoin/state/atoms";
import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { generateWalletFromSeed } from "wallet/generator";

const testSeed: string =
  "153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc";

const ImportWallet = () => {
  const [seed, setSeed] = useState<string>(testSeed);
  const setWallet = useSetRecoilState(btcWalletsState);

  const importWallet = async () => {
    const wallet = await generateWalletFromSeed(
      testSeed,
      BitcoinWallet,
      pubKeyTransformer
    );

    setWallet((currentWallets) => [...currentWallets, wallet]);
  };

  return (
    <View>
      <TextInput value={seed} />
      <Button onPress={importWallet} title="Import Wallet" />
    </View>
  );
};

export default ImportWallet;
