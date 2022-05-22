import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  encrypt,
  generateKeyPair,
} from 'react-native-secure-encryption-module';

export default function App() {
  const originalValue = 'Encrypt this';

  const [result, setResult] = React.useState();
  const [encrypted, setEncrypted] = React.useState();

  React.useEffect(() => {
    generateKeyPair('NewKey').then(onGenerateFinish);
  }, []);

  const onGenerateFinish = (res: any) => {
    setResult(res);

    encrypt(originalValue, 'NewKey').then((result) => {});
  };

  return (
    <View style={styles.container}>
      <Text>Original Value: {originalValue}</Text>
      <Text>CreateKeyPairResult: {result}</Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
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
