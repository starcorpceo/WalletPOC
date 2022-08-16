import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { Address } from "wallet/types/wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "EthereumReceiveScreen">;

const EthereumReceiveScreen = ({ route }: Props) => {
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
    setReceiveAddress(wallet.external.addresses[0]);
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
      <Image
        style={styles.icon}
        source={{ uri: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png" }}
      />
      <Text style={styles.heading}>Your ETH address</Text>
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
  icon: { width: 14, height: 25, marginBottom: 6 },
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

export default EthereumReceiveScreen;
