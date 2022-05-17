import { StyleSheet } from 'react-native';
import { styles } from "./TabOneScreen.styles";

import EditScreenInfo from '@Components/EditScreenInfo';
import { Text, View } from '@Components/Themed';
import { RootTabScreenProps } from '@Types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One Hello there</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

