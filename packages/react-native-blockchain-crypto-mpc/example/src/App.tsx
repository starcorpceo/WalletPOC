import * as React from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { deriveBIP32 } from './examples/deriveBip32';
import { importSecret } from './examples/importSecret';
import { signEcdsa } from './examples/signEcdsa';

const testSecret =
  '153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc';

export default function App() {
  const [serverMessage, setServerMessage] = React.useState<
    string | undefined
  >();
   // const [clientPubKey, setClientPubKey] = React.useState<any | undefined>();
  // const [seedShare, setSeedShare] = React.useState<any | undefined>();

   const [signSuccess, setSignSuccess] = React.useState<boolean>();
   const [signResOnClient, setSignResOnClient] = React.useState<boolean>();

  const [secret, setSecret] = React.useState<string>(testSecret);
  const [xPub, setxPub] = React.useState<any>();
  const [derivedShare, setDerivedShare] = React.useState<any>();

  React.useEffect(() => {
    const doit = async () => {
      //await generateSecret(setServerMessage, setSeedShare);
      // await generateEcdsa(setServerMessage, setClientPubKey);
      //await signEcdsa(setSignSuccess, setSignResOnClient);
    };

    doit();
  }, []);

  const importSecretOnPress = async () => {
    await importSecret(secret!, setServerMessage);
  };

  const deriveBIPMaster = async () => {
    await deriveBIP32(setxPub, setDerivedShare);
  };

  const signStuff = async () => {
    await signEcdsa(setSignSuccess,setSignResOnClient)
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Hex Seed:</Text>
        <TextInput
          style={styles.input}
          value={testSecret}
          onChangeText={setSecret}
        />
        <Button onPress={importSecretOnPress} title="Import now">
          Import now
        </Button>
        <Text>Result init client: {JSON.stringify(serverMessage)}</Text>
        <Button onPress={deriveBIPMaster} title="Derive" />
        <Text>xPub: {JSON.stringify(xPub)}</Text>
        <Text>Derived Sahre: {JSON.stringify(derivedShare)}</Text>
        {/* <Text>Result generic secret: {JSON.stringify(seedShare)}</Text> */}
        

        <Button onPress={signStuff} title="Sign Stuff" />
        {/* <Text>Pub key client: {JSON.stringify(clientPubKey)}</Text> */}
        <Text>Signature verified by Server: {JSON.stringify(signSuccess)}</Text>
        <Text>
          Signature verified by Client: {JSON.stringify(signResOnClient)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  input: {
    width: 280,
    height: 30,
    backgroundColor: 'grey',
  },
});
