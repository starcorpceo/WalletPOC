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
import { JSONRPCClient } from "json-rpc-2.0";

import "../shim"
const ec = new Elliptic.ec("secp256k1");
const bitcoin = require('bitcoinjs-lib');

import { RegtestUtils } from 'regtest-client';

const APIPASS = process.env.APIPASS || 'satoshi';
const APIURL = process.env.APIURL || 'https://regtest.bitbank.cc/1';

export const regtestUtils = new RegtestUtils({ APIPASS, APIURL });

const dhttp = regtestUtils.dhttp;
const TESTNET = bitcoin.networks.testnet;

const apiKey = "89156412-0b04-4ed1-aede-d4546b60697c";

const testSecret =
  '153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc';

// tstbtc back to mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB

export default function App() {
  const [serverMessage, setServerMessage] = React.useState<string | undefined>();
  // const [clientPubKey, setClientPubKey] = React.useState<any | undefined>();
  // const [seedShare, setSeedShare] = React.useState<any | undefined>();

  const [signSuccess, setSignSuccess] = React.useState<boolean>();
  const [signResOnClient, setSignResOnClient] = React.useState<boolean>();

  const [secret, setSecret] = React.useState<string>(testSecret);
  const [address, setAddress] = React.useState<any>();
  const [balance, setBalance] = React.useState<any>();
  const [transactions, setTransactions] = React.useState<any>();

  const importSecretOnPress = async () => {
    await importSecret(secret!, setServerMessage);
    deriveBIPMaster();
  };

  const deriveBIPMaster = async () => {
    const pk = await deriveBIP32();

    const key = ec.keyFromPublic(pk.slice(23));
    const pubkeyBuf = Buffer.from(key.getPublic().encode('hex'), 'hex')
    const pubkey = bitcoin.ECPair.fromPublicKey(pubkeyBuf)
    const { address } = bitcoin.payments.p2pkh({ pubkey: pubkey.publicKey, network: TESTNET });
    //const address = "mmqpxx41Fr1kKGSGkVbeJjqeKK3itcy2e6"
    //const address = "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5"
    console.log(address)
    setAddress(address)

    fetch(`https://api-eu1.tatum.io/v3/bitcoin/address/balance/${address}`,
    {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    }).then((response) => response.text().then((resp) => setBalance(JSON.parse(resp).incoming)))


    const queryTransactions = new URLSearchParams({
      pageSize: '10',
      offset: '0'
    }).toString();
    
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/bitcoin/transaction/address/${address}?${queryTransactions}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': apiKey
        }
      }
    );
    
    const trx = await resp.text();
    console.log(trx);
    setTransactions(JSON.parse(trx))
    
    
  };

  const signTransaction = async () => {

    var tx = new bitcoin.TransactionBuilder();

    await signEcdsa(setSignSuccess,setSignResOnClient)
  };

  const sendBTC = async () => {
    /*const resp = await fetch(
      `https://api-eu1.tatum.io/v3/bitcoin/broadcast`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          txData: '62BD544D1B9031EFC330A3E855CC3A0D51CA5131455C1AB3BCAC6D243F65460D',
        })
      }
    );
    
    const data = await resp.json();
    console.log(data);*/

    console.log("last transaction small : " , transactions[0].hash)

    const psbt = new bitcoin.Psbt({TESTNET})
      .addInput({
        hash: transactions[0].hash,
        index: transactions[0].index,
        nonWitnessUtxo: Buffer.from(transactions[0].hash, 'hex')
      }) 
      .addOutput({
        address: "",
        value: (0.0001 * 100000000), 
      })
      .addOutput({
        address: address,
        value: ((transactions[0].outputs[1].value - (0.0001 * 100000000)) - 0.00005), 
      })
  }

  const getAddress = async () => {
    importSecretOnPress();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Button onPress={getAddress} title="Get address" />
        <Text>Your BTC-address: {address}</Text>
        <Text>Balance: {balance} BTC</Text>

        <View style={{textAlign: "center"}}>    
          <Text>Latest transaction</Text>
          {transactions && transactions.map((t) => {
              return(
                <Text> + {t.outputs[1].value / 100000000} BTC</Text>
              )
            })
          }
        </View>

        <Button onPress={sendBTC} title="Send 0.0001 BTC" />

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
