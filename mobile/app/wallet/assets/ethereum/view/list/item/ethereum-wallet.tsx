import { EthereumWallet } from "ethereum/types/Ethereum";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProvider } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { authState } from "state/atoms";
import { EthereumBalance } from "./ethereum-wallet-balance";

type EthereumWalletProps = {
  wallet: EthereumWallet;
  updateWallet: (newAccount: EthereumWallet, index: number) => void;
  index: number;
};

const EthereumWalletView = ({ wallet, updateWallet, index }: EthereumWalletProps) => {
  const [service] = useState(new EthereumService("TEST"));
  const user = useRecoilValue(authState);

  const updateBalance = useCallback(async () => {
    const balance = await service.getBalance(wallet.external.addresses[0].address, EthereumProvider.ALCHEMY);

    updateWallet({ ...wallet, ethBalance: balance.value }, index);
  }, [, service]);

  const updateTransactions = useCallback(async () => {
    const transactions = await service.getTransactions(
      wallet.external.addresses[0].address,
      new URLSearchParams(),
      EthereumProvider.ALCHEMY
    );

    updateWallet({ ...wallet, ethTransactions: transactions }, index);
  }, [, service]);

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
        <View>
          <Text key={addr.publicKey}>{addr.address}</Text>
        </View>
      ))}
      <EthereumBalance updateBalance={updateBalance} wallet={wallet} />
      <EthereumTransactions updateTransactions={updateTransactions} wallet={wallet} />
      {/* <SendEthereum user={user} wallet={wallet} /> */}
    </View>
  );
};

export default EthereumWalletView;
BitcoinTransactionBitcoinTransaction;
