import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EthereumAccountBuilder } from "ethereum/controller/ethereum-account-creation";
import { EthereumWalletsState, ethereumWalletsState } from "ethereum/state/ethereum-atoms";
import React, { useCallback, useEffect } from "react";
import { Button } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { getPurposeWallet } from "state/utils";
import { initialCoinState } from "wallet/state/wallet-state-utils";
import Wallets from "wallet/view/generic-wallet-screen";
import EthereumWalletListView from "./list/ethereum-wallet-list";

type Props = NativeStackScreenProps<NavigationRoutes, "Ethereum">;

const Ethereum = ({ route }: Props) => {
  const [ethereumState, setEthereum] = useRecoilState<EthereumWalletsState>(ethereumWalletsState);
  const purposeKeyShare = useRecoilValue(getPurposeWallet);

  const { isStateEmpty, user } = route.params;

  useEffect(() => {
    const onOpen = async () => {
      if (ethereumState.accounts.length > 0 || !isStateEmpty) return;

      const accountBuilder = new EthereumAccountBuilder(user);

      const newState = await accountBuilder
        .init()
        .then((builder) => builder.useCoinTypeShare(purposeKeyShare, ethereumState.coinTypeKeyShare))
        .then((builder) => builder.createAccount(false))
        .then((builder) => builder.createChange("external"))
        .then((builder) => builder.build());

      setEthereum(() => newState);
    };

    onOpen();
  }, []);

  const deleteEthereumAccount = useCallback(() => {
    setEthereum((_) => initialCoinState);
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
