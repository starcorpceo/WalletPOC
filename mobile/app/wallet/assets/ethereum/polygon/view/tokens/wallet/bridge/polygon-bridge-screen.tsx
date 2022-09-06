import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { NavigationRoutes } from "shared/types/navigation";

import { styles } from "./polygon-bridge-style";
import PolygonDepositView from "./polygon-deposit-view";
import PolygonWithdrawView from "./withdraw/polygon-withdraw-view";

type Props = NativeStackScreenProps<NavigationRoutes, "PolygonBridgeScreen">;

const PolygonBridgeScreen = ({ route }: Props) => {
  const { address, posClient, plasmaClient } = route.params;

  const [switchValue, setSwitchValue] = useState<string>("deposit");
  return (
    <View>
      <View style={styles.switchArea}>
        <TouchableOpacity
          style={switchValue == "deposit" ? styles.switchButton : styles.switchButtonInactive}
          onPress={() => setSwitchValue("deposit")}
        >
          <Text>Deposit</Text>
        </TouchableOpacity>
        <View style={styles.switchPadding} />
        <TouchableOpacity
          style={switchValue == "withdraw" ? styles.switchButton : styles.switchButtonInactive}
          onPress={() => setSwitchValue("withdraw")}
        >
          <Text>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <View>
        {switchValue == "deposit" && <PolygonDepositView address={address} polygonClient={posClient} />}
        {switchValue == "withdraw" && (
          <PolygonWithdrawView address={address} posClient={posClient} plasmaClient={plasmaClient} />
        )}
      </View>
    </View>
  );
};

export default PolygonBridgeScreen;
