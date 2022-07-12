import { deriveBIP32, signEcdsa } from "lib/mpc";
import React, { useCallback, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import {
  getResultDeriveBIP32,
  verifySignature,
} from "react-native-blockchain-crypto-mpc";
import { useSetRecoilState } from "recoil";
import { AuthState, authState } from "state/atoms";
import { SecretWallet, ShareWallet, Wallet } from "../../api-types/wallet";
import { groupStyle } from "./style";

type TestMpcWalletProps = {
  wallet: Wallet;
  userId: string;
  devicePublicKey: string;
};

const TestMpcWallet = ({
  wallet,
  userId,
  devicePublicKey,
}: TestMpcWalletProps) => {
  const setAuth = useSetRecoilState(authState);
  const [messageToSign, setMessageToSign] = useState("Sign me please");

  const [signature, setSignature] = useState("");

  const [index, setIndex] = useState("0");
  const [hardened, setHardened] = useState("0");

  const [signOK, setSignOK] = useState<boolean>();

  const deriveCallback = useCallback(
    async (share: ShareWallet | SecretWallet) => {
      const shareOrSecret = share.share || share.genericSecret;
      const context = await deriveBIP32(
        devicePublicKey,
        userId,
        wallet.id,
        shareOrSecret as string,
        index,
        hardened
      );

      const derivedShare = await getResultDeriveBIP32(context.clientContext);

      setAuth((current: AuthState) => {
        return {
          ...current,
          wallets: [
            ...current.wallets,
            {
              parentWalletId: wallet.id,
              id: context.serverShareId,
              mainShare: derivedShare,
            },
          ],
        };
      });
    },
    [wallet, userId, setAuth, devicePublicKey, index, hardened]
  );

  const signCallback = useCallback(
    async (share: ShareWallet) => {
      const signature = await signEcdsa(
        devicePublicKey,
        userId,
        wallet.id,
        share.share,
        messageToSign
      );

      setSignature(signature);
    },
    [wallet, messageToSign, userId, setSignature, devicePublicKey]
  );

  const verifyCallback = useCallback(
    async (share: string) => {
      const ok = await verifySignature(messageToSign, signature, share);

      setSignOK(ok);
    },
    [messageToSign, signature, setSignOK]
  );

  return (
    <View
      style={{ ...groupStyle, padding: 8, margin: 8, backgroundColor: "white" }}
    >
      <View style={groupStyle}>
        <Text>Id: {wallet.id}</Text>
        {wallet.parentWalletId && (
          <Text>Parent ID: {wallet.parentWalletId}</Text>
        )}

        <Text>This is your key share: {wallet.share?.slice(0, 23)}</Text>
        <Text>This is your secret: {wallet.genericSecret?.slice(0, 23)}</Text>
      </View>

      <View style={groupStyle}>
        <Text>Index</Text>
        <TextInput value={index} onChangeText={setIndex} />
        <Text>Hardened</Text>
        <TextInput value={hardened} onChangeText={setHardened} />
        <Button
          title="Derive from generic Secret or share"
          onPress={() => deriveCallback(wallet as ShareWallet | SecretWallet)}
        />
      </View>

      <View style={groupStyle}>
        <Text>Sign "{messageToSign}" with current Key Share</Text>
        <Button
          title="Sign!"
          onPress={() => signCallback(wallet as ShareWallet)}
        />
        <Text>Signature: {signature}</Text>
        <Button
          title="Verify!"
          onPress={() => verifyCallback(wallet.share as string)}
        />
        <Text>OK: {`${signOK}`}</Text>
      </View>
    </View>
  );
};

export default TestMpcWallet;
