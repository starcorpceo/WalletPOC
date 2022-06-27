import * as React from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Elliptic from "elliptic";
import { deriveBIP32 } from './examples/deriveBip32';
import { importSecret } from './examples/importSecret';
import { signEcdsa } from './examples/signEcdsa';

import "../shim"
const ec = new Elliptic.ec("secp256k1");
const bitcoin = require('bitcoinjs-lib');


const testSecret =
  '153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc';

export default function App() {
  const [serverMessage, setServerMessage] = React.useState<string | undefined>();
  // const [clientPubKey, setClientPubKey] = React.useState<any | undefined>();
  // const [seedShare, setSeedShare] = React.useState<any | undefined>();

  const [signSuccess, setSignSuccess] = React.useState<boolean>();
  const [signResOnClient, setSignResOnClient] = React.useState<boolean>();

  const [secret, setSecret] = React.useState<string>(testSecret);
  const [address, setAddress] = React.useState<any>();

  const importSecretOnPress = async () => {
    await importSecret(secret!, setServerMessage);
    deriveBIPMaster();
  };

  const deriveBIPMaster = async () => {
    const pk = await deriveBIP32();

    const key = ec.keyFromPublic(pk.slice(23));
    const pubkeyBuf = Buffer.from(key.getPublic().encode('hex'), 'hex')
    const pubkey = bitcoin.ECPair.fromPublicKey(pubkeyBuf)
    const { address } = bitcoin.payments.p2wpkh({ pubkey: pubkey.publicKey });
    console.log(address)
    setAddress(address)
  };

  const signStuff = async () => {
    await signEcdsa(setSignSuccess,setSignResOnClient)
  };

  const getAddress = async () => {
    importSecretOnPress();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Button onPress={getAddress} title="Get address" />
        <Text>Your BTC-address: {address}</Text>

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
