import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initGenerateEcdsaKey } from 'react-native-blockchain-crypto-mpc';

export default function App() {
  const [result, setResult] = React.useState<string | undefined>();

  React.useEffect(() => {
    initGenerateEcdsaKey().then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {JSON.stringify(result)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
