import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleProp, Text, TextStyle, useColorScheme, View } from "react-native";

type Props = NativeStackScreenProps<NavigationRoutes, "GettingStarted">;

const GettingStarted = ({ navigation }: Props) => {
  const isDarkMode = useColorScheme() === "dark";

  const textStyle: StyleProp<TextStyle> = {
    color: isDarkMode ? "#fff" : "#000",
    fontWeight: "700",
    textAlign: "center",
  };

  return (
    <View>
      <Text>Has to be implemented</Text>
    </View>
  );
};

export default GettingStarted;
