import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EthereumAccountBuilder } from "ethereum/controller/ethereum-account-creation";
import { EthereumWalletsState, ethereumWalletsState } from "ethereum/state/atoms";
import React, { useCallback, useEffect } from "react";
import { Button } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { AuthState, authState } from "state/atoms";
import { getPurposeWallet } from "state/utils";
import Wallets from "wallet/view/generic-wallet-view";
import EthereumWalletListView from "./list/ethereum-wallet-list";

type Props = NativeStackScreenProps<NavigationRoutes, "Ethereum">;

const Ethereum = ({ navigation }: Props) => {
  const [ethereumState, setEthereum] = useRecoilState<EthereumWalletsState>(ethereumWalletsState);
  const user = useRecoilValue<AuthState>(authState);

  const purposeKeyShare = useRecoilValue(getPurposeWallet);

  console.log("Ethereum updated", { ethereumState });

  useEffect(() => {
    const onOpen = async () => {
      if (ethereumState.accounts.length > 0) return;

      const accountBuilder = new EthereumAccountBuilder(user);

      const newState = await accountBuilder
        .init()
        .then((builder) => builder.useCoinTypeShare(purposeKeyShare, ethereumState.coinTypeKeyShare))
        .then((builder) => builder.createAccount(false))
        .then((builder) => builder.createChange("internal"))
        .then((builder) => builder.createChange("external"))
        .then((builder) => builder.build());

      console.log("Before set", newState);

      setEthereum(() => newState);
    };

    onOpen();
  }, []);

  const deleteEthereumAccount = useCallback(() => {
    setEthereum((current) => ({ ...current, accounts: [] }));
  }, [setEthereum]);

  return (
    <Wallets name="Ethereum">
      {ethereumState.accounts[0] && (
        <>
          <EthereumWalletListView wallets={ethereumState.accounts} />

          <Button onPress={deleteEthereumAccount} title="Delete Ethereum Account" />
        </>
      )}
    </Wallets>
  );
};

export default Ethereum;
