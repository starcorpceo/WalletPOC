import { createDeviceKey } from "lib/auth";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { sign } from "react-native-secure-encryption-module";
import { CreateUserResponse } from "../../api-types/user";
import constants from "../../config/constants";
import { fetchFromApi } from "../../lib/http";

const CreateWallet = () => {
  const [userCreateResult, setUserCreateResult] = useState<boolean>();

  useEffect(() => {
    registerOnApi().then(setUserCreateResult);
  }, []);

  return (
    <View>
      <Text>Now you can create your wallet</Text>
      <Text>{userCreateResult && "Successfully created user"}</Text>
    </View>
  );
};

const registerOnApi = async (): Promise<boolean> => {
  try {
    const devicePublicKey = await createDeviceKey();

    const res = await fetchFromApi<CreateUserResponse>("/user/create", {
      devicePublicKey,
    });

    console.log("create user response on client", res);
    if (!res) return false;
    const signature = await sign(res.nonce, constants.deviceKeyName);

    const wha = await fetchFromApi<boolean>("/user/verify", {
      message: res.nonce,
      signature,
      userId: res.userId,
      devicePublicKey,
    });

    return !!wha;
  } catch (e) {
    return await false;
    //Refactor me
  }
};

export default CreateWallet;
