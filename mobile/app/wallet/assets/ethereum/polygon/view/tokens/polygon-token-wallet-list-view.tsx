import { POSClient } from "@maticnetwork/maticjs";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { erc20Tokens } from "ethereum/polygon/config/tokens";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { styles } from "../ethereum-polygon-styles";
type Props = NativeStackScreenProps<NavigationRoutes, "TokenWalletScreen">;

type PolygonTokenWalletListViewProps = {
  polygonClient: POSClient;
  address: string;
  navigation: NativeStackNavigationProp<NavigationRoutes, "EthereumPolygonScreen", undefined>;
};

const PolygonTokenWalletListView = ({ polygonClient, address, navigation }: PolygonTokenWalletListViewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.heading}>Token Wallets</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("PolygonBridgeScreen", { address, polygonClient })}
        >
          <Text style={styles.headerButtonText}>Polygon Bridge</Text>
        </TouchableOpacity>
      </View>
      {erc20Tokens.map((token) => {
        return (
          <TouchableOpacity
            style={styles.actionButton}
            key={token.polygonAddress}
            onPress={() => navigation.navigate("PolygonTokenWalletScreen", { token, polygonClient, address })}
          >
            <Text style={styles.actionButtonText}>
              {token.name} Wallet {"\u2192"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PolygonTokenWalletListView;
