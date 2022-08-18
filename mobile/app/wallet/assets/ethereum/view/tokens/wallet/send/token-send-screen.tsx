import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { abi } from "ethereum/config/general-abi";
import { ERC20Token } from "ethereum/config/token-constants";
import { buildRawTokenTransaction, buildRawTransaction } from "ethereum/controller/ethereum-transaction-utils";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import { EthereumWallet } from "ethereum/types/ethereum";
import { ethers } from "ethers";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import "shim";
import { authState, AuthState } from "state/atoms";
import { Address } from "wallet/types/wallet";

type Props = NativeStackScreenProps<NavigationRoutes, "TokenSendScreen">;

const TokenSendScreen = ({ route }: Props) => {
  const [token, setToken] = useState<ERC20Token>(route.params.token);
  const [wallet, setWallet] = useState<EthereumWallet>(route.params.wallet);
  const [address, setAddress] = useState<Address>(route.params.wallet.external.addresses[0]);
  const user = useRecoilValue<AuthState>(authState);

  const [toAddress, setToAddress] = useState<string>("0x49e749dc596ebb62b724262928d0657f8950a7d7");
  const [tokenToSend, setTokenToSend] = useState<string>("");

  useEffect(() => {
    setSigner(new MPCSigner(wallet.external.addresses[0], user).connect(ethers.getDefaultProvider("goerli")));
  }, []);

  const [signer, setSigner] = useState<MPCSigner>();
  const [service] = useState(new EthereumService("TEST"));
  const sendTransaction = useCallback(async () => {
    if (!service || !signer) return;
    try {
      const gasPrice = await service.getFees(EthereumProviderEnum.ALCHEMY);

      const address = wallet.external.addresses[0];
      const transactionCount = await service.getTransactionCount(address.address, EthereumProviderEnum.ALCHEMY);

      const transaction = await buildRawTokenTransaction(
        abi,
        token.contractAddress,
        toAddress,
        Number.parseFloat(tokenToSend),
        transactionCount,
        gasPrice,
        token,
        signer,
        service
      );

      const rawTransaction = await signer.signTransaction(transaction);

      console.log("Transaction to be published: ", rawTransaction);

      Alert.alert("Confirm your transaction", "Sending " + tokenToSend + " " + token.symbol + " to " + toAddress, [
        {
          text: "Send now",
          onPress: () => broadcast(rawTransaction),
        },
        {
          text: "Cancel",
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  }, [wallet, user, tokenToSend, toAddress]);

  const broadcast = useCallback(
    async (finalRawTransaction: string) => {
      if (!service) return;

      try {
        const result = await service.sendRawTransaction(finalRawTransaction, EthereumProviderEnum.ALCHEMY);
        Alert.alert("Successfully sent.");
      } catch (err) {
        console.log(err);
        Alert.alert("Unable to broadcast transaction");
      }
    },
    [service]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Send {token.name}</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Receiver Address"
          onChangeText={setToAddress}
          value={toAddress}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder={"0 " + token.symbol}
          onChangeText={(value) => setTokenToSend(value)}
          value={tokenToSend?.toString()}
        ></TextInput>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={sendTransaction}>
        <Text style={styles.actionButtonText}>Send</Text>
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
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    marginTop: 14,
    borderRadius: 10,
    fontSize: 14,
  },
  actionButton: {
    height: 42,
    width: "100%",
    backgroundColor: "#3828e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TokenSendScreen;
