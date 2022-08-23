import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { buildRawTransaction } from "ethereum/controller/ethereum-transaction-utils";
import { gWeiToEth, gWeiToWei } from "ethereum/controller/ethereum-utils";
import { EthereumWalletsState, ethereumWalletsState } from "ethereum/state/ethereum-atoms";
import { useAddMempoolTransaction } from "ethereum/state/ethereum-wallet-state-utils";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import "shim";

type Props = NativeStackScreenProps<NavigationRoutes, "EthereumSendScreen">;

const EthereumSendScreen = ({ route }: Props) => {
  const [gWeis, setGWeis] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("0x49e749dc596ebb62b724262928d0657f8950a7d7");

  const etherem = useRecoilValue<EthereumWalletsState>(ethereumWalletsState);
  const wallet = etherem.accounts[0];
  const { service, signer } = route.params;
  const addMempoolTransaction = useAddMempoolTransaction(ethereumWalletsState);

  const broadcast = useCallback(
    async (finalRawTransaction: string, mempoolTransaction: EthereumTransaction) => {
      if (!service) return;

      try {
        const result = await service.sendRawTransaction(finalRawTransaction, EthereumProviderEnum.ALCHEMY);
        mempoolTransaction.hash = result.toString();
        Alert.alert("Successfully sent.");

        addMempoolTransaction(mempoolTransaction, wallet);
      } catch (err) {
        console.log(err);
        Alert.alert("Unable to broadcast transaction");
      }
    },
    [service, addMempoolTransaction]
  );

  const sendTransaction = useCallback(async () => {
    if (!service || !signer) return;
    try {
      const gasPrice = await service.getFees(EthereumProviderEnum.ALCHEMY);

      const address = wallet.external.addresses[0];
      const transactionCount =
        (await service.getTransactionCount(address.address, EthereumProviderEnum.ALCHEMY)) + wallet.mempool.length;

      const transaction = buildRawTransaction(
        toAddress,
        gWeiToWei(Number.parseFloat(gWeis)),
        transactionCount,
        gasPrice
      );

      const rawTransaction = await signer.signTransaction(transaction);

      let mempoolTransaction: EthereumTransaction = getMempoolTransaction(address.address, toAddress, gWeis);

      Alert.alert(
        "Confirm your transaction",
        "Sending " + gWeis + " gWeis (" + gWeiToEth(Number(gWeis)) + " ETH) to " + toAddress,
        [
          {
            text: "Send now",
            onPress: () => broadcast(rawTransaction, mempoolTransaction),
          },
          {
            text: "Cancel",
          },
        ]
      );
    } catch (err) {
      console.error(err);
    }
  }, [wallet, gWeis, toAddress, broadcast, signer, service]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Send Ethereum</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Receiver Address"
          onChangeText={setToAddress}
          value={toAddress}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="0 gWei"
          onChangeText={(value) => setGWeis(value)}
          value={gWeis?.toString()}
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

const getMempoolTransaction = (from: string, to: string, gWeis: string): EthereumTransaction => ({
  blockNum: "",
  hash: "",
  from,
  to,
  value: gWeiToWei(Number.parseFloat(gWeis)),
  erc721TokenId: null,
  erc1155Metadata: null,
  tokenId: null,
  asset: "",
  category: "",
  rawContract: {
    value: "",
    address: "",
    decimal: "",
  },
});

export default EthereumSendScreen;
