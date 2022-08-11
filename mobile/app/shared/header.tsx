import { useNavigation } from "@react-navigation/native";
import { CreateUserResponse, User } from "api-types/user";
import { signWithDeviceKey } from "lib/auth";
import { fetchFromApi, HttpMethod } from "lib/http";
import React, { useCallback, useEffect } from "react";
import { Button, Text, View } from "react-native";
import { deleteKeyPair, generateKeyPair, getKey } from "react-native-secure-encryption-module";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState, initialAuthState } from "state/atoms";
import { getAllWallets, useResetWalletState } from "wallet/state/wallet-state-utils";
import constants, { emptyKeyPair } from "../config/constants";
import { KeyShareType } from "./types/mpc";

const Header = () => {
  const setAuth = useSetRecoilState<AuthState>(authState);
  const { bitcoin, account: auth } = useRecoilValue(getAllWallets);

  const navigation = useNavigation();

  const resetWallets = useResetWalletState();

  console.log("Auth updated", { auth });
  console.log("Bitcoin updated", { bitcoin });

  const initUser = useCallback(async () => {
    getKey(constants.deviceKeyName)
      .then((devicePublicKey) => {
        console.log("Key already exists it is assumed this phone already has a user in store");
      })
      .catch(async () => {
        const newDevicePublicKey = await generateKeyPair(constants.deviceKeyName);

        createProfile(newDevicePublicKey);
      });
  }, []);

  const createProfile = useCallback(
    async (devicePublicKey: string) => {
      const user = await createNewProfile(devicePublicKey);
      setAuth((_) => user);
    },
    [setAuth]
  );

  useEffect(() => {
    initUser();
  }, []);

  return (
    <View>
      <Text>Your Device Key: {auth.devicePublicKey.slice(0, 5)}...</Text>
      <Text>Your User id: {auth.id}</Text>

      <Button
        onPress={() => {
          try {
            navigation.navigate("Home" as never);
            setAuth((_: AuthState) => ({ ...initialAuthState }));
            resetWallets();
            deleteKeyPair(constants.deviceKeyName);
            initUser();
          } catch (err) {
            console.error("Error while resetting", err);
          }
        }}
        title="Reset Local State"
      />
    </View>
  );
};

const createNewProfile = async (devicePublicKey: string): Promise<User> => {
  const { nonce, userId } = await fetchFromApi<CreateUserResponse>("/user/create", {
    body: {
      devicePublicKey,
    },
  });

  const deviceSignature = await signWithDeviceKey(nonce);

  const success = await fetchFromApi<boolean>("/user/verify", {
    body: {
      deviceSignature,
      userId,
      devicePublicKey,
    },
    method: HttpMethod.POST,
    args: { credentials: "include" },
  });

  return {
    id: userId,
    devicePublicKey,
    keyShares: [],
    bip44MasterKeyShare: { ...emptyKeyPair, type: KeyShareType.MASTER },
  };
};

export default Header;
