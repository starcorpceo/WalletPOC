import Bitcoin from "bitcoin/view/bitcoin";
import React from "react";
import { Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { AuthState, authState } from "state/atoms";
import GenerateWallet from "./create/generate-wallet";
import ImportWallet from "./create/import-wallet";

const WalletOverview = () => {
  const user = useRecoilValue<AuthState>(authState);

  return (
    <View>
      {!user.bip44MasterWallet ? (
        <>
          <Text>
            You dont have an Account with Corresponding Wallets yet. Import or
            derive a Master Key (BIP44 root)
          </Text>
          <GenerateWallet user={user} />
          <ImportWallet user={user} />
        </>
      ) : (
        <Bitcoin />
      )}
    </View>
  );
};

export default WalletOverview;
