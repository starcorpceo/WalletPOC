import { signWithDeviceKey } from "lib/auth";
import { fetchFromApi, HttpMethod } from "lib/http";
import React, { useCallback, useEffect } from "react";
import { Button, Text, View } from "react-native";
import {
  deleteKeyPair,
  generateKeyPair,
  getKey,
} from "react-native-secure-encryption-module";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthState, authState, initialAuthState } from "state/atoms";
import { getAllWallets, useResetWalletState } from "state/utils";
import { CreateUserResponse, User } from "../api-types/user";
import constants from "../config/constants";

const Header = () => {
  const setAuth = useSetRecoilState<AuthState>(authState);
  const { bitcoin, account: auth } = useRecoilValue(getAllWallets);

  const resetWallets = useResetWalletState();

  console.log("Auth updated", { auth });
  console.log("Bitcoin updated", { bitcoin });

  const onStart = useCallback(async () => {
    getKey(constants.deviceKeyName)
      .then((devicePublicKey) => {
        console.log(
          "Key already exists it is assumed this phone already has a user in store"
        );
      })
      .catch(async () => {
        const newDevicePublicKey = await generateKeyPair(
          constants.deviceKeyName
        );

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
    onStart();
  }, []);

  return (
    <View>
      <Text>Your Device Key: {auth.devicePublicKey.slice(0, 5)}...</Text>
      <Text>Your User id: {auth.id}</Text>

      <Button
        onPress={() => {
          try {
            setAuth((_: AuthState) => ({ ...initialAuthState }));
            resetWallets();
            deleteKeyPair(constants.deviceKeyName);
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
  const { nonce, userId } = await fetchFromApi<CreateUserResponse>(
    "/user/create",
    {
      body: {
        devicePublicKey,
      },
    }
  );

  const signature = await signWithDeviceKey(nonce);

  const success = await fetchFromApi<boolean>("/user/verify", {
    body: {
      signature,
      userId,
      devicePublicKey,
    },
    method: HttpMethod.POST,
    args: { credentials: "include" },
  });

  return {
    id: userId,
    devicePublicKey,
    wallets: [],
    bip44MasterWallet: undefined,
  };
};

export default Header;
