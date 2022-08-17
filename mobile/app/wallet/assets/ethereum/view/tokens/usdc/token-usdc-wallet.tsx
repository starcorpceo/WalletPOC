import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { buildRawTokenTransaction } from "ethereum/controller/ethereum-transaction-utils";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import { ethers } from "ethers";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import {
  EthereumTokenBalance,
  EthereumTokenBalances,
  EthereumTransaction,
} from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { authState, AuthState } from "state/atoms";
import { abi } from "./abi-array";

type Props = NativeStackScreenProps<NavigationRoutes, "TokenUsdcWalletScreen">;

const usdcContractAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";

const TokenUsdcWalletScreen = ({ route }: Props) => {
  const [toAddress, setToAddress] = useState<string>("0x49e749dc596ebb62b724262928d0657f8950a7d7");
  const [usdcSendAmount, setUSDCSendAmount] = useState<string>("");

  const [tokenBalanceUSDC, setTokenBalanceUSDC] = useState<EthereumTokenBalance>();
  const [transactions, setTransactions] = useState<EthereumTransaction[]>();
  const wallet = route.params.wallet;
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);
  const user = useRecoilValue<AuthState>(authState);

  const [service] = useState(new EthereumService("TEST"));

  const [signer, setSigner] = useState<MPCSigner>();
  useEffect(() => {
    setSigner(new MPCSigner(wallet.external.addresses[0], user).connect(ethers.getDefaultProvider("goerli")));
  }, []);

  useEffect(() => {
    updateBalance();
  }, []);

  const updateBalance = () => {
    const loadBalance = async () => {
      setLoadingBalance(true);
      let tokenAddr: string[] = [];
      tokenAddr.push(usdcContractAddress); //should be usdc
      const tokenBalances: EthereumTokenBalances = await service.getTokenBalances(
        wallet.external.addresses[0].address,
        tokenAddr,
        EthereumProviderEnum.ALCHEMY
      );
      setTokenBalanceUSDC(tokenBalances.tokenBalances[0]);
      setLoadingBalance(false);
    };
    loadBalance();
  };

  const updateTransactions = async () => {
    setLoadingTransactions(true);
    const transactions: EthereumTransaction[] = await service.getERC20Transactions(
      wallet.external.addresses[0].address,
      EthereumProviderEnum.ALCHEMY
    );
    console.log(transactions);
    setTransactions(transactions);
    setLoadingTransactions(false);
  };

  const sendTransaction = async () => {
    if (!service || !signer) return;

    const gasPrice = await service.getFees(EthereumProviderEnum.ALCHEMY);
    const fromAddress = wallet.external.addresses[0];
    const transactionCount = await service.getTransactionCount(fromAddress.address, EthereumProviderEnum.ALCHEMY);

    const transaction = await buildRawTokenTransaction(
      abi,
      usdcContractAddress,
      toAddress,
      Number.parseFloat(usdcSendAmount),
      transactionCount,
      gasPrice,
      signer
    );

    const rawTransaction = await signer.signTransaction(transaction);

    console.log("Token Transaction to be published: ", rawTransaction);

    Alert.alert("Confirm your transaction", "Sending", [
      {
        text: "Send now",
        onPress: () => broadcast(rawTransaction),
      },
      {
        text: "Cancel",
      },
    ]);
  };

  const broadcast = useCallback(
    async (finalRawTransaction: string) => {
      if (!service) return;

      try {
        const result = await service.sendRawTransaction(finalRawTransaction, EthereumProviderEnum.ALCHEMY);
        Alert.alert("Successfully sent.");

        //addMempoolTransaction(mempoolTransaction, wallet);
      } catch (err) {
        console.log(err);
        Alert.alert("Unable to broadcast transaction");
      }
    },
    [service]
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headingAreaTop}>
        <Image style={styles.icon} source={{ uri: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" }} />
        <Text style={styles.heading}>USDC Wallet</Text>
      </View>
      <View style={styles.balanceContainer}>
        <View style={{ flexDirection: "row" }}>
          {tokenBalanceUSDC && (
            <Text style={styles.balanceText}>{Number.parseInt(tokenBalanceUSDC?.tokenBalance, 16) / 10 ** 6} USDC</Text>
          )}
          {!tokenBalanceUSDC && <Text style={styles.balanceText}>0 USDC</Text>}
          {loadingBalance && <ActivityIndicator />}
        </View>
        <TouchableOpacity onPress={updateBalance}>
          <Image
            style={styles.reloadIcon}
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/reload-retry-again-update-restart-refresh-sync-13-3149.png",
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.heading}>Send USDC</Text>

        <View>
          <TextInput
            style={styles.input}
            placeholder="Receiver Address"
            onChangeText={setToAddress}
            value={toAddress}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="0.0 USDC"
            onChangeText={(value) => setUSDCSendAmount(value)}
            value={usdcSendAmount?.toString()}
          ></TextInput>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={sendTransaction}>
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headingArea}>
        <Text style={styles.heading}>Unordered History</Text>
        <TouchableOpacity onPress={updateTransactions}>
          <Image
            style={styles.reloadIcon}
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/reload-retry-again-update-restart-refresh-sync-13-3149.png",
            }}
          />
        </TouchableOpacity>
      </View>

      {loadingTransactions && <ActivityIndicator />}

      {transactions &&
        transactions.map((transaction) => {
          const isPlus = transaction.to === wallet.external.addresses[0].address;
          const colorBackground = !isPlus ? "#fcf2f2" : "#f3fcf2";

          const pre = isPlus ? "+" : "-";
          return (
            <View key={transaction.hash} style={[styles.transaction, { backgroundColor: colorBackground }]}>
              {isPlus ? (
                <Text>{transaction.from.slice(0, 16) + "..."}</Text>
              ) : (
                <Text>{transaction.to.slice(0, 16) + "..."}</Text>
              )}
              <Text key={transaction.hash} style={{ color: isPlus ? "green" : "red" }}>
                {pre +
                  Number.parseInt(transaction.rawContract.value, 16) /
                    10 ** Number.parseInt(transaction.rawContract.decimal, 16)}{" "}
                USDC
              </Text>
            </View>
          );
        })}
    </ScrollView>
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
    maxHeight: "80%",
  },
  headingAreaTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  headingArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "lightgrey",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: "normal",
    marginRight: 8,
  },
  reloadIcon: {
    width: 20,
    height: 20,
  },
  icon: { width: 25, height: 25, marginRight: 6 },
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

export default TokenUsdcWalletScreen;
