import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  getPublicKey,
  initGenerateEcdsaKey,
  step,
} from 'react-native-blockchain-crypto-mpc';

export default function App() {
  const [serverMessage, setServerMessage] = React.useState<
    string | undefined
  >();

  const [clientPubKey, setClientPubKey] = React.useState<any | undefined>();

  React.useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8080/initGenerateEcdsaKey');

    ws.onopen = () => {
      console.log('opened connection');
      initGenerateEcdsaKey().then((firstMessage) => {
        ws.send(new Uint8Array(firstMessage).buffer);
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      const receivedMessage = JSON.parse(message.data);
      console.log('message client', receivedMessage);

      if (receivedMessage === true) {
      }

      step(receivedMessage).then((nextMessage) => {
        nextMessage.length < 100 &&
          console.log('step result client', nextMessage);

        ws.send(new Uint8Array(nextMessage).buffer);
      });
      setServerMessage(message.data);
      return false;
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };

    ws.onclose = (event) => {
      console.log('closed', event);

      getPublicKey().then((pubKey) => {
        console.log('client pub', pubKey);
        setClientPubKey(JSON.stringify(pubKey));
      });
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Result init client: {JSON.stringify(serverMessage)}</Text>
        <Text>Pub key client: {JSON.stringify(clientPubKey)}</Text>
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
});
