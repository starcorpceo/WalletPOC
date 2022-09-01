import { POSClient, setProofApi, use } from "@maticnetwork/maticjs";
import Web3ClientPlugin from "@maticnetwork/maticjs-ethers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MPCSigner } from "ethereum/controller/zksync/signer";
import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import PolygonCheckTransaction from "./polygon-check-transaction";
import PolygonTokenWalletListView from "./tokens/polygon-token-wallet-list-view";
import PolygonPendingWithdrawList from "./tokens/wallet/bridge/withdraw/polygon-pending-withdraw-list-view";

type Props = NativeStackScreenProps<NavigationRoutes, "EthereumPolygonScreen">;

const EthereumPolygonScreen = ({ route, navigation }: Props) => {
  const [polygonClient, setPolygonClient] = useState<POSClient>();
  const { signer, address } = route.params;

  const createPolygonAccount = useCallback(async () => {
    if (!signer) throw new Error("Signer is undefined, cannot access Polygon Client View without Signer");
    const client = new POSClient();

    const alchemy = new ethers.providers.AlchemyProvider("maticmum", "ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0");

    const childSigner = new MPCSigner(signer.getAddressObj(), signer.getUser()).connect(alchemy);

    await client.init({
      log: true,
      network: "testnet",
      version: "mumbai",
      parent: {
        provider: signer,
        defaultConfig: {
          from: address,
        },
      },
      child: {
        provider: childSigner,
        defaultConfig: {
          from: address,
        },
      },
    });
    // TODO: For Production host this ourselves because of performance
    setProofApi("https://apis.matic.network/");

    setPolygonClient(client);
  }, [setPolygonClient, signer]);

  const setupPolygon = useCallback(async () => {
    use(Web3ClientPlugin);

    await createPolygonAccount();
  }, [createPolygonAccount]);

  useEffect(() => {
    setupPolygon();
  }, []);

  if (!polygonClient) {
    return <Text>Client loading...</Text>;
  }

  return (
    <ScrollView
      scrollEnabled={true}
      style={{
        maxHeight: "80%",
      }}
    >
      <PolygonTokenWalletListView address={address} navigation={navigation} polygonClient={polygonClient} />
      <PolygonPendingWithdrawList polygonClient={polygonClient} address={address} />
      <PolygonCheckTransaction polygonClient={polygonClient} />
    </ScrollView>
  );
};

export default EthereumPolygonScreen;
