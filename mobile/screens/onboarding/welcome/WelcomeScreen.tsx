import { styles } from "./WelcomeScreen.styles";

import EditScreenInfo from '@Components/EditScreenInfo';
import { Text, View } from '@Components/Themed';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's start</Text>
    </View>
  );
}

