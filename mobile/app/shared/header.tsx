import { fetchFromApi } from "lib/http";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { initGenerateEcdsaKey } from "react-native-blockchain-crypto-mpc";
import {
  generateKeyPair,
  getKey,
  sign,
} from "react-native-secure-encryption-module";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { CreateUserResponse } from "../api-types/user";
import constants from "../config/constants";

const Header = () => {
  const [auth, setAuth] = useRecoilState(authState);

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

    initGenerateEcdsaKey()
      .then((x) => console.log("init step for generate", x))
      .catch((e) => console.log("Error on init", e));
    onStartup();
  }, [setAuth]);

  return (
    <View>
      <Text>Your Device Key: {auth.devicePublicKey.slice(0, 5)}...</Text>
      <Text>Your User id: {auth.userId}</Text>
    </View>
  );
};

const createProfile = async (setAuth: SetterOrUpdater<AuthState>) => {
  const newDevicePublicKey = await generateKeyPair(constants.deviceKeyName);

  const { nonce, userId } = await fetchFromApi<CreateUserResponse>(
    "/user/create",
    {
      devicePublicKey: newDevicePublicKey,
    }
  );

  const signature = await sign(nonce, constants.deviceKeyName);

  console.log("request to ", { signature, newDevicePublicKey, nonce });

  const success = await fetchFromApi<boolean>("/user/verify", {
    message: nonce,
    signature,
    userId,
    devicePublicKey: newDevicePublicKey,
  });

  success &&
    setAuth({
      userId,
      devicePublicKey: newDevicePublicKey,
    });
};

export default Header;
