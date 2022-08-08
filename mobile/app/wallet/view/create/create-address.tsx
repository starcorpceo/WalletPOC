import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { AuthState, authState } from "state/atoms";
import { CoinTypeState } from "state/types";
import { createAddress } from "wallet/controller/creation/address-creation";
import { useAddAddress } from "wallet/state/wallet-state-utils";
import { CoinTypeAccount } from "wallet/types/wallet";

interface CreateBitcoinWalletProps<T extends CoinTypeAccount> {
  wallet: CoinTypeAccount;
  state: CoinTypeState<T>;
}

const CreateAddress = <T extends CoinTypeAccount>({ wallet, state }: CreateBitcoinWalletProps<T>) => {
  const user = useRecoilValue<AuthState>(authState);
  const setAddAddress = useAddAddress(state);

  const startGenerate = useCallback(async () => {
    const address = await createAddress(user, wallet, "external");
    setAddAddress([address], wallet, "external");
  }, [user, wallet, setAddAddress]);

  return (
    <View
      style={{
        borderTopColor: "black",
        borderTopWidth: StyleSheet.hairlineWidth,
        marginTop: 24,
        paddingTop: 12,
      }}
    >
      <Text>You can always create more addresses:</Text>
      <Button onPress={startGenerate} title="Create new Address" />
    </View>
  );
};

export default CreateAddress;
