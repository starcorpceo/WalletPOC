import { User } from "api-types/user";
import constants from "config/constants";
import React, { useCallback } from "react";
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { KeyShareType } from "shared/types/mpc";
import { AuthState, authState } from "state/atoms";
import { createMPCKeyShare, deriveMpcKeyShare } from "wallet/controller/creation/derived-share-creation";

type GenerateWalletProps = {
  user: User;
  setLoading: Function;
};

const GenerateMasterAndPurpose = ({ user, setLoading }: GenerateWalletProps) => {
  const setAuth = useSetRecoilState<AuthState>(authState);

  const startGenerate = useCallback(async () => {
    setLoading(1);
    try {
      const bip44MasterKeyShare = await createMPCKeyShare(user);

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
    } catch (err) {
      Alert.alert("Wrong local authentication.", "You typed in the wrong password.");
      setLoading(0);
    }
    setLoading(0);
  }, [setAuth, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>If you dont have an Seed, generate an new Account.</Text>
      <TouchableOpacity style={styles.actionButton} onPress={startGenerate}>
        <Text style={styles.actionButtonText}>Generate Account</Text>
      </TouchableOpacity>
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

export default GenerateMasterAndPurpose;
