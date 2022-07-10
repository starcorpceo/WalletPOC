import { pubKeyTransformer } from "bitcoin/controller/bitcoinjs";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/atoms";
import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { BitcoinWallet } from "wallet/bitcoin";
import { generateWalletFromSeed } from "wallet/generator";
import { User } from "../../../../api-types/user";

type ImportWalletProps = {
  user: User;
};

const testSeed: string =
  "153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc";

const ImportWallet = ({ user }: ImportWalletProps) => {
  const [seed, setSeed] = useState<string>(testSeed);
  const setWallet = useSetRecoilState(bitcoinWalletsState);

  const importWallet = async () => {
    const wallet = await generateWalletFromSeed<BitcoinWallet>(
      testSeed,
      user,
      pubKeyTransformer
    );

    setWallet((currentWallets: BitcoinWalletsState) => [
      ...currentWallets,
      wallet,
    ]);
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
