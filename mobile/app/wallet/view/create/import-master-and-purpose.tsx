import constants, { emptyKeyPair } from "config/constants";
import React, { useCallback, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { createMPCKeyShareFromSeed, deriveMpcKeyShare } from "wallet/controller/creation/derived-share-creation";

import { User } from "api-types/user";
import { deepCompare } from "lib/util";
import { KeyShareType, MasterKeyShare } from "shared/types/mpc";

type ImportWalletProps = {
  user: User;
};

const importSeed1: string =
  "706d8345a2823515777b836ba84591ded4aa849e469e326cc22af26c88bf95a991d5ac0fcd736bafab2294ca9b4129d2f8d09147c03a2e0e3692216fb43373c9";

const ImportMasterAndPurpose = ({ user }: ImportWalletProps) => {
  const [seed, setSeed] = useState<string>(importSeed1);

  const setAuth = useSetRecoilState<AuthState>(authState);

  const derivePurposeShare = useCallback(
    async (masterKeyShare: MasterKeyShare) => {
      const purposeKeyShare = await deriveMpcKeyShare(
        masterKeyShare,
        user,
        constants.bip44PurposeIndex,
        true,
        KeyShareType.PURPOSE
      );

      setAuth((auth: AuthState) => {
        return {
          ...auth,
          keyShares: [...auth.keyShares, purposeKeyShare],
        };
      });
    },
    [setAuth, user]
  );

  const importMaster = useCallback(async () => {
    const bip44MasterKeyShare = await createMPCKeyShareFromSeed(seed, user);

    setAuth((current) => ({ ...current, bip44MasterKeyShare }));

    derivePurposeShare(bip44MasterKeyShare);
  }, [setAuth, seed, user]);

  const isCleanStart = deepCompare(user.bip44MasterKeyShare, {
    ...emptyKeyPair,
    type: KeyShareType.MASTER,
  });

  return (
    <View style={{ padding: 4 }}>
      <TextInput onChangeText={setSeed} value={seed} style={{ backgroundColor: "white", padding: 4 }} />
      {isCleanStart ? (
        <Button onPress={importMaster} title="Import Wallet" />
      ) : (
        <>
          <Text>
            Looks like you are in the middle of importing or generating a Wallet. If you just stared, please wait a
            moment. If you aborted the Import Process for some reason, you can Continue the import safely:
          </Text>
          <Button onPress={() => derivePurposeShare(user.bip44MasterKeyShare)} title="Continue Wallet Import" />
        </>
      )}
    </View>
  );
};

export default ImportMasterAndPurpose;
