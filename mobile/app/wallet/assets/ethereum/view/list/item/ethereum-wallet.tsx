import { EthereumWallet } from "ethereum/types/Ethereum";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import { EthereumTransaction } from "packages/blockchain-api-client/src/blockchains/ethereum/types";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { authState } from "state/atoms";
import { Transaction } from "wallet/types/wallet";
import { EthereumBalance } from "./ethereum-wallet-balance";
import SendEthereum from "./ethereum-wallet-send";
import EthereumTransactions from "./ethereum-wallet-transactions";

type EthereumWalletProps = {
  wallet: EthereumWallet;
  updateWallet: (newAccount: EthereumWallet, index: number) => void;
  index: number;
};

const EthereumWalletView = ({ wallet, updateWallet, index }: EthereumWalletProps) => {
  const [service] = useState(new EthereumService("TEST"));

  const user = useRecoilValue(authState);

  const updateBalance = useCallback(async () => {
    const balance = await service.getBalance(wallet.external.addresses[0].address, EthereumProviderEnum.ALCHEMY);

    updateWallet({ ...wallet, ethBalance: balance.value }, index);
  }, [index, updateWallet, service]);

  const updateTransactions = useCallback(async () => {
    const transactions = await service.getTransactions(
      wallet.external.addresses[0].address,
      EthereumProviderEnum.ALCHEMY
    );

    const newTransactions = [...(wallet.transactions as EthereumTransaction[]), ...transactions];

    updateWallet(
      {
        ...wallet,
        transactions: newTransactions
          .filter(onlyUniqueTransactions)
          .sort((a, b) => Number.parseInt(a.blockNum, 16) - Number.parseInt(b.blockNum, 16)),
      },
      index
    );
  }, [index, updateWallet, service]);

  const addTransaction = useCallback(
    async (transaction: EthereumTransaction) => {
      updateWallet(
        {
          ...wallet,
          transactions: [...wallet.transactions, transaction],
        },
        index
      );
    },
    [index, updateWallet]
  );

  return (
    <View
      style={{
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        margin: 10,
      }}
    >
      <Text>Addresses</Text>
      {wallet.external.addresses.map((addr) => (
        <View key={addr.address}>
          <Text>Addr: {addr.address}</Text>
        </View>
      ))}
      <EthereumBalance updateBalance={updateBalance} wallet={wallet} />
      <EthereumTransactions updateTransactions={updateTransactions} wallet={wallet} />
      <SendEthereum user={user} wallet={wallet} service={service} addTransaction={addTransaction} />
    </View>
  );
};

function onlyUniqueTransactions(value: Transaction, index: number, self: Transaction[]) {
  return self.findIndex((trans) => trans.hash === value.hash) === index;
}

export default EthereumWalletView;
