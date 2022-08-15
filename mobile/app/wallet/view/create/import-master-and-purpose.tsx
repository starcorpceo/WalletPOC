import constants, { emptyKeyPair } from "config/constants";
import React, { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { createMPCKeyShareFromSeed, deriveMpcKeyShare } from "wallet/controller/creation/derived-share-creation";

import { User } from "api-types/user";
import { deepCompare } from "lib/util";
import { KeyShareType, MasterKeyShare } from "shared/types/mpc";

type ImportWalletProps = {
  user: User;
  setLoading: Function;
};

const importSeed1: string =
  "706d8345a2823515777b836ba84591ded4aa849e469e326cc22af26c88bf95a991d5ac0fcd736bafab2294ca9b4129d2f8d09147c03a2e0e3692216fb43373c9";

const ImportMasterAndPurpose = ({ user, setLoading }: ImportWalletProps) => {
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
      setLoading(0);
    },
    [setAuth, user]
  );

  const importMaster = useCallback(async () => {
    setLoading(2);
    try {
      const bip44MasterKeyShare = await createMPCKeyShareFromSeed(seed, user);

      setAuth((current) => ({ ...current, bip44MasterKeyShare }));

      derivePurposeShare(bip44MasterKeyShare);
    } catch (err) {
      Alert.alert("Wrong local authentication.", "You typed in the wrong password.");
      setLoading(0);
    }
  }, [setAuth, seed, user]);

  const isCleanStart = deepCompare(user.bip44MasterKeyShare, {
    ...emptyKeyPair,
    type: KeyShareType.MASTER,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Already have a seed? Use it.</Text>
      <TextInput style={styles.input} onChangeText={setSeed} value={seed} />
      {isCleanStart ? (
        <TouchableOpacity style={styles.actionButton} onPress={importMaster}>
          <Text style={styles.actionButtonText}>Import Seed</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text>
            Looks like you are in the middle of importing or generating a Wallet. If you just stared, please wait a
            moment. If you aborted the Import Process for some reason, you can Continue the import safely:
          </Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => derivePurposeShare(user.bip44MasterKeyShare)}>
            <Text style={styles.actionButtonText}>Continue Wallet Import</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    margin: 12,
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    marginTop: 14,
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    height: 42,
    backgroundColor: "#3828e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ImportMasterAndPurpose;
