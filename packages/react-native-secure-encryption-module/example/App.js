/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';
import {
  decrypt,
  encrypt,
  generateKeyPair,
} from 'react-native-secure-encryption-module';

const App = () => {
  const [result, setResult] = React.useState();

  const originalValue = 'Encrypt this';

  const [encrypted, setEncrypted] = React.useState();
  const [decrypted, setDecrypted] = React.useState();

  React.useEffect(() => {
    const doit = async () => {
      console.log('Generating Keypiar');
      const x = await generateKeyPair('NewKey');

      console.log('Keypiar', x);
      setResult('Ass' + JSON.stringify(x));

      const encryptedVal = await encrypt(originalValue, 'NewKey');
      console.log('Encrypted', encryptedVal);
      setEncrypted(encryptedVal);

      const decryptedVal = await decrypt(encryptedVal, 'NewKey');
      console.log('Decrypted', decryptedVal);
      setDecrypted(decryptedVal);
    };
    doit();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{backgroundColor: 'white'}}>
          <Text>Original Text: {`${originalValue}`}</Text>
          <Text>Generation Result: {`${result}`}</Text>
          <Text>Encrypted Value: {`${encrypted}`}</Text>
          <Text>Decrypted Value: {`${decrypted}`}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
