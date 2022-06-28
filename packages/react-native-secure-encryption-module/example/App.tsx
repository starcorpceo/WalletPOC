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
  getKey,
  isKeySecuredOnHardware,
  sign,
  verify,
} from 'react-native-secure-encryption-module';

const App = () => {
  const [result, setResult] = React.useState<string>();

  const originalValue = 'Encrypt this';
  const messageToSign = 'Sign Me Please';

  const [encrypted, setEncrypted] = React.useState<string>();
  const [decrypted, setDecrypted] = React.useState<string>();
  const [signature, setSignature] = React.useState<string>();
  const [secure, setSecure] = React.useState<boolean>();
  const [ok, setOk] = React.useState<boolean>();

  React.useEffect(() => {
    const doit = async () => {
      console.log('Generating Keypiar');
      const key = await generateKeyPair('NewKey');

      setResult(key);

      encrypt(originalValue, 'NewKey')
        .then(async encryptedVal => {
          setEncrypted(encryptedVal);
          const decryptedVal = await decrypt(encryptedVal, 'NewKey');
          console.log('Decrypted', decryptedVal);
          setDecrypted(decryptedVal);
        })
        .catch(setEncrypted);

      const sig = await sign(messageToSign, 'NewKey');
      setSignature(sig);

      const signatureOk = await verify(sig, messageToSign, 'NewKey');
      setOk(signatureOk);

      const isSecure = await isKeySecuredOnHardware('NewKey');
      setSecure(isSecure);

      try {
        await getKey('Does not exist');
      } catch (err) {
        console.log(err);
      }
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
