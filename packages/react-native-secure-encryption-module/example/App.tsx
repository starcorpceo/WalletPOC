/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {
  decrypt,
  deleteKeyPair,
  encrypt,
  generateKeyPair,
  getKey,
  isKeySecuredOnHardware,
  sign,
  verify,
} from 'react-native-secure-encryption-module';

const keyName = 'NewKey';

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
      const key = await generateKeyPair(keyName);

      setResult(key);

      encrypt(originalValue, keyName)
        .then(async encryptedVal => {
          setEncrypted(encryptedVal);
          const decryptedVal = await decrypt(encryptedVal, keyName);
          console.log('Decrypted', decryptedVal);
          setDecrypted(decryptedVal);
        })
        .catch(setEncrypted);

      const sig = await sign(messageToSign, keyName);
      setSignature(sig);

      const signatureOk = await verify(sig, messageToSign, keyName);
      setOk(signatureOk);

      const isSecure = await isKeySecuredOnHardware(keyName);
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
    <SafeAreaView style={{}}>
      <>
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
            <Button onPress={deleteKey} title="Delete Key" />
          </View>
        </ScrollView>
      </>
    </SafeAreaView>
  );
};

const deleteKey = async () => {
  try {
    await deleteKeyPair(keyName);

    getKey(keyName)
      .then(key => console.log('Key found, this is weird', key))
      .catch(e =>
        console.log('Key not found, that means deletion was a success!', e),
      );
  } catch (e) {
    console.error('Delete Key was not successfull', e);
  }
};

export default App;
