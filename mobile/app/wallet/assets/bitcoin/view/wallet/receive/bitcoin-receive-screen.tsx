import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getNextUnusedAddress } from "bitcoin/controller/bitcoin-address";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { authState, AuthState } from "state/atoms";
import { Address } from "wallet/types/wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "BitcoinSendScreen">;

const BitcoinReceiveScreen = ({ route }: Props) => {
  const user = useRecoilValue<AuthState>(authState);
  const [receiveAddress, setReceiveAddress] = useState<Address>();
  const [copyText, setCopyText] = useState<string>("Copy Address");
  const wallet = route.params.account;

  useEffect(() => {
    const onOpen = async () => {
      showReceiveAddress();
    };

    onOpen();
  }, []);

  const showReceiveAddress = async () => {
    setReceiveAddress(await getNextUnusedAddress(user, wallet, "external"));
  };

  const copyToClipboard = () => {
    if (receiveAddress) {
      Clipboard.setStringAsync(receiveAddress.address);
      setCopyText("Copied to Clipboard");
      setTimeout(() => {
        setCopyText("Copy Address");
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={{ uri: "https://bitcoin.org/img/icons/opengraph.png?1657703267" }} />
      <Text style={styles.heading}>Your BTC address</Text>
      {receiveAddress && <Text style={styles.addressText}>{receiveAddress.address}</Text>}
      {!receiveAddress?.address && (
        <Text style={styles.addressText}>
          <ActivityIndicator />
        </Text>
      )}
      <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
        <Text style={styles.actionButtonText}>{copyText}</Text>
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
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: { width: 25, height: 25, marginBottom: 6 },
  addressText: {
    fontSize: 17,
    textAlign: "center",
    margin: 16,
    marginHorizontal: 32,
  },
  actionButton: {
    height: 42,
    width: 260,
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

export default BitcoinReceiveScreen;
