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
  isKeySecuredOnHardware,
  sign,
  verify,
} from 'react-native-secure-encryption-module';

const App = () => {
  const [result, setResult] = React.useState();

  const originalValue = 'Encrypt this';
  const messageToSign = 'Sign Me Please';

  const [encrypted, setEncrypted] = React.useState();
  const [decrypted, setDecrypted] = React.useState();
  const [signature, setSignature] = React.useState();
  const [secure, setSecure] = React.useState();
  const [ok, setOk] = React.useState();

  React.useEffect(() => {
    const doit = async () => {
      console.log('Generating Keypiar');
      const x = await generateKeyPair('NewKey');

      console.log('Keypiar', x);
      setResult(JSON.stringify(x));

      const encryptedVal = await encrypt(originalValue, 'NewKey');
      console.log('Encrypted', encryptedVal);
      setEncrypted(encryptedVal);

      const decryptedVal = await decrypt(encryptedVal, 'NewKey');
      console.log('Decrypted', decryptedVal);
      setDecrypted(decryptedVal);

      const sig = await sign(messageToSign, 'NewKey');
      setSignature(sig);

      const signatureOk = await verify(sig, messageToSign, 'NewKey');
      setOk(signatureOk);

      const isSecure = await isKeySecuredOnHardware('NewKey');
      setSecure(isSecure);
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
          <Text>Message To Sign: {messageToSign}</Text>
          <Text>Signed Value: {`${signature}`}</Text>
          <Text>Signature ok : {`${ok}`}</Text>
          <Text>Is key secured on hardware Level: {`${secure}`}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
