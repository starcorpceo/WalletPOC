import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { config } from "ethereum/config/ethereum-config";
import React from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { NavigationRoutes } from "shared/types/navigation";

type Props = NativeStackScreenProps<NavigationRoutes, "RampOn">;

const url = config.IsTestNet ? "https://ri-widget-staging-goerli2.firebaseapp.com" : "https://buy.ramp.network";

const RampOn = ({ route }: Props) => {
  const { userAddress, token } = route.params;
  return (
    <View style={{ width: "100%", height: "80%" }}>
      <WebView source={{ uri: `${url}?userAddress=${userAddress}&defaultAsset=${token}` }} />
    </View>
  );
};

export default RampOn;
