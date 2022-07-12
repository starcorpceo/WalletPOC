import {
  BitcoinWalletsState,
  bitcoinWalletsState,
  initialBitcoinState,
} from "bitcoin/state/atoms";
import { signWithDeviceKey } from "lib/auth";
import { fetchFromApi, HttpMethod } from "lib/http";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";
import {
  deleteKeyPair,
  generateKeyPair,
  getKey,
} from "react-native-secure-encryption-module";
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from "recoil";
import { AuthState, authState, initialAuthState } from "state/atoms";
import { CreateUserResponse } from "../api-types/user";
import constants from "../config/constants";

const Header = () => {
  const [auth, setAuth] = useRecoilState<AuthState>(authState);
  const setBitcoinState = useSetRecoilState(bitcoinWalletsState);

  useEffect(() => {
    const onStartup = async () => {
      getKey(constants.deviceKeyName)
        .then((_) => {
          console.log(
            "Key already exists it is assumed this phone already has a user in store"
          );
        })
        .catch(() => createProfile(setAuth));
    };

    onStartup();
  }, [setAuth]);

  return (
    <View>
      <Text>Your Device Key: {auth.devicePublicKey.slice(0, 5)}...</Text>
      <Text>Your User id: {auth.id}</Text>

      <Button
        onPress={() => {
          setAuth((_: AuthState) => initialAuthState);
          setBitcoinState((_: BitcoinWalletsState) => initialBitcoinState);
          deleteKeyPair(constants.deviceKeyName);
        }}
        title="Reset Local State"
      />
    </View>
  );
};

const createProfile = async (setAuth: SetterOrUpdater<AuthState>) => {
  const newDevicePublicKey = await generateKeyPair(constants.deviceKeyName);

  const { nonce, userId } = await fetchFromApi<CreateUserResponse>(
    "/user/create",
    {
      body: {
        devicePublicKey: newDevicePublicKey,
      },
    }
  );

  const signature = await signWithDeviceKey(nonce);

  const success = await fetchFromApi<boolean>("/user/verify", {
    body: {
      signature,
      userId,
      devicePublicKey: newDevicePublicKey,
    },
    method: HttpMethod.POST,
    args: { credentials: "include" },
  });

  success &&
    setAuth((oldState) => {
      return {
        ...oldState,
        id: userId,
        devicePublicKey: newDevicePublicKey,
      };
    });
};

export default Header;
