import Elliptic from 'elliptic';
import * as React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import '../shim';
import { BTCBalanceDriver } from './balance/driver/BTCBalanceDriver';
import { deriveBIP32 } from './examples/deriveBip32';
import { importSecret } from './examples/importSecret';
import { signEcdsa } from './examples/signEcdsa';

import * as bitcoin from 'bitcoinjs-lib';

const ec = new Elliptic.ec('secp256k1');

const TESTNET = bitcoin.networks.testnet;

const tatumApiKey = '89156412-0b04-4ed1-aede-d4546b60697c';

const testSecret =
  '153649e88ae8337f53451d8d0f4e6fd7e1860620923fc04192c8abc2370b68dc';
// Lautsch

// const testSecret =
//   '153649e88ae8337f53451d8d0f4e6fd7e1860626923fc04192c8abc2370b68dc';
// Matsi

// tstbtc back to mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB

export default function App() {
  const [senderPubKeyBuf, setSenderPubKeyBuf] = React.useState<Buffer>();
  const [address, setAddress] = React.useState<any>();
  const [balance, setBalance] = React.useState<any>();
  const [transactions, setTransactions] = React.useState<any>();

  const importSecretOnPress = async (setSenderPubKeyBuf: Function) => {
    await importSecret(testSecret, (seed: string) =>
      console.log('Seed share', seed)
    );
    deriveBIPMaster(setSenderPubKeyBuf);
  };

  const deriveBIPMaster = async (setSenderPubKeyBuf: Function) => {
    const pk = await deriveBIP32();

    const key = ec.keyFromPublic(pk.slice(23));

    // For BitcoinJs
    const pubkeyBuf = Buffer.from(key.getPublic().encode('hex', false), 'hex');

    const pubkey = bitcoin.ECPair.fromPublicKey(pubkeyBuf);

    setSenderPubKeyBuf(pubkey.publicKey);

    const { address } = bitcoin.payments.p2pkh({
      pubkey: pubkey.publicKey,
      network: TESTNET,
    });
    //const address = "mmqpxx41Fr1kKGSGkVbeJjqeKK3itcy2e6"
    //const address = "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5"
    console.log(address);
    setAddress(address);

    fetchBalanceAndTransactions(address || '', setTransactions, setBalance);
  };

  const sendBTC = async (senderPubKeyKub: Buffer | undefined) => {
    if (senderPubKeyKub === undefined) {
      console.log('Sender Pub Key empty quit bitch');
      return;
    }

    console.log('we clain pub key is', {
      pubKey: Buffer.from(senderPubKeyKub).toString('hex'),
    });

    const myEc: bitcoin.SignerAsync = {
      publicKey: senderPubKeyKub as Buffer,
      sign: async (hash) => {
        const sig = await signEcdsa(hash);

        return sig;
      },
    };

    const psbt = new bitcoin.Psbt({ network: TESTNET })
      .addInput({
        hash: transactions[0].hash,
        index: 1, //transactions[0].index,
        nonWitnessUtxo: Buffer.from(transactions[0].hex, 'hex'),
      })
      .addOutput({
        address: 'mxuQMQAsnbYTRqWhenF1Hj4qf5CvcE8L8c',
        value: 0.0001 * 100000000,
      })
      .addOutput({
        address: address,
        value:
          transactions[0].outputs[1].value -
          0.0001 * 100000000 -
          0.00005 * 100000000,
      });

    try {
      await psbt.signAllInputsAsync(myEc);
      console.log('all ok ', psbt.validateSignaturesOfAllInputs());
      psbt.finalizeAllInputs();
    } catch (err) {
      console.error('wtf', err);
    }

    console.log('Extracted Transaction', psbt.extractTransaction().toHex());

    const resp = await fetch(`https://api-eu1.tatum.io/v3/bitcoin/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': tatumApiKey,
      },
      body: JSON.stringify({
        txData: psbt.extractTransaction().toHex(),
      }),
    });

    const data = await resp.json();
    console.log('result after sending transact', data);
  };

  const getAddress = async () => {
    importSecretOnPress(setSenderPubKeyBuf);
  };
  console.log('oida', address);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Button onPress={getAddress} title="Get address" />
        <Text>Your BTC-address: {address}</Text>
        <Text>Balance: {balance} BTC</Text>

        <View style={{ textAlign: 'center' }}>
          <Text>Latest transaction</Text>
          {transactions &&
            transactions.map((t) => {
              return <Text> + {t.outputs[1].value / 100000000} BTC</Text>;
            })}
        </View>

        <Button
          onPress={() => sendBTC(senderPubKeyBuf)}
          title="Send 0.0001 BTC"
        />
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

const fetchBalanceAndTransactions = async (
  address: string,
  setTransactions: Function,
  setBalance: Function
) => {
  // fetch(`https://api-eu1.tatum.io/v3/bitcoin/address/balance/${address}`, {
  //   method: 'GET',
  //   headers: {
  //     'x-api-key': tatumApiKey,
  //   },
  // }).then((response) =>
  //   response.text().then((resp) => setBalance(JSON.parse(resp).incoming))
  // );
  const btcBalanceDriver = new BTCBalanceDriver('btc');
  console.log(
    'fetched balance: ',
    await btcBalanceDriver.fetchBalance(address)
  );

  const queryTransactions = new URLSearchParams({
    pageSize: '10',
    offset: '0',
  }).toString();

  const resp = await fetch(
    `https://api-eu1.tatum.io/v3/bitcoin/transaction/address/${address}?${queryTransactions}`,
    {
      method: 'GET',
      headers: {
        'x-api-key': tatumApiKey,
      },
    }
  );

  const trx = await resp.text();
  console.log(trx);
  setTransactions(JSON.parse(trx));
};
