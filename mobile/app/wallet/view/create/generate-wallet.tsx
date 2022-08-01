import { User } from "api-types/user";
import constants from "config/constants";
import React, { useCallback } from "react";
import { Button } from "react-native";
import { useSetRecoilState } from "recoil";
import { KeyShareType } from "shared/mpc";
import { AuthState, authState } from "state/atoms";
import {
  deriveMpcKeyShare,
  generateMPCKeyShare,
} from "wallet/controller/generator";

type GenerateWalletProps = {
  user: User;
};

const GenerateWallet = ({ user }: GenerateWalletProps) => {
  const setAuth = useSetRecoilState<AuthState>(authState);

  const startGenerate = useCallback(async () => {
    const bip44MasterKeyShare = await generateMPCKeyShare(user);

    const purposeKeyShare = await deriveMpcKeyShare(
      bip44MasterKeyShare,
      user,
      constants.bip44PurposeIndex,
      true,
      KeyShareType.PURPOSE
    );

    setAuth((auth: AuthState) => {
      return {
        ...auth,
        bip44MasterKeyShare,
        keyShares: [...auth.keyShares, purposeKeyShare],
      };
    });
  }, [setAuth, user]);

  return <Button onPress={startGenerate} title="Generate Wallet" />;
};

export default GenerateWallet;
