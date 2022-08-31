import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";
import { styles as polygonStyles } from "../../ethereum-polygon-styles";
import { TokenBalanceView } from "./balance/polygon-token-balance-view";
import TokenTransactionsView from "./transaction/polygon-token-transactions-view";

type Props = NativeStackScreenProps<NavigationRoutes, "PolygonTokenWalletScreen">;

const PolygonTokenWalletScreen = ({ route, navigation }: Props) => {
  const { token, address, polygonClient } = route.params;

  const childErc20 = polygonClient.erc20(token.polygonAddress, false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headingArea}>
        <Text style={styles.heading}>{token.name} Wallet</Text>
      </View>

      <TokenBalanceView address={address} childErc20={childErc20} token={token} />

      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("PolygonTokenSendScreen", { token, childErc20 })}
        >
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <TokenTransactionsView address={address} token={token} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...polygonStyles,
  actionArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 22,
    marginBottom: 22,
  },
  headingArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
});
export default PolygonTokenWalletScreen;
