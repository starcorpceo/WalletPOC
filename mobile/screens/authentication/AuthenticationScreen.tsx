import { styles } from "./AuthenticationScreen.styles";

import EditScreenInfo from '@Components/EditScreenInfo';
import { Text, View } from '@Components/Themed';

export default function AuthenticationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authenticate yourself.</Text>
    </View>
  );
}