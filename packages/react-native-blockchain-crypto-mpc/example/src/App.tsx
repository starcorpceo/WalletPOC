import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  getPublicKey,
  getSignature,
  initGenerateEcdsaKey,
  initSignEcdsa,
  step,
  verifySignature,
} from 'react-native-blockchain-crypto-mpc';

import { Buffer } from 'buffer';

export default function App() {
  const [serverMessage, setServerMessage] = React.useState<
    string | undefined
  >();
  const [clientPubKey, setClientPubKey] = React.useState<any | undefined>();

  const [signSuccess, setSignSuccess] = React.useState<boolean>();
  const [signResOnClient, setSignResOnClient] = React.useState<boolean>();

  React.useEffect(() => {
    const doit = async () => {
      await generateEcdsa(setServerMessage, setClientPubKey);
      await signEcdsa(setSignSuccess, setSignResOnClient);
    };

    doit();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Result init client: {JSON.stringify(serverMessage)}</Text>
        <Text>Pub key client: {JSON.stringify(clientPubKey)}</Text>
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
});

type SignStatus = 'Init' | 'Stepping';

const signEcdsa = (setSuccess: Function, setSignResOnClient: Function) => {
  const ws = new WebSocket(getApi('ws') + '/sign');
  const stringToSign = 'Hello World';
  let signStatus: SignStatus = 'Init';
  const bufferToSign = Buffer.from(stringToSign);

  ws.onopen = () => {
    ws.send(bufferToSign);
  };
  const messageChars = [...bufferToSign];

  ws.onmessage = (message: WebSocketMessageEvent) => {
    console.log('message on clinet', JSON.parse(message.data));
    switch (signStatus) {
      case 'Init':
        const msg = JSON.parse(message.data);

        if (msg.value !== 'Start') {
          return;
        }

        signStatus = 'Stepping';

        initSignEcdsa(messageChars).then((success) => {
          if (success)
            step(null).then((firstMessage) => {
              ws.send(new Uint8Array(firstMessage).buffer);
            });
        });

        break;
      case 'Stepping':
        const receivedMessage = JSON.parse(message.data);

        if (receivedMessage === true) {
        }

        step(receivedMessage).then((nextMessage) => {
          ws.send(new Uint8Array(nextMessage).buffer);
        });
        break;
    }
  };

  ws.onerror = (error) => {
    console.log('err', error);
  };

  ws.onclose = (event) => {
    console.log('closed', event);

    getSignature().then((signature) => {
      fetch(getApi('http') + '/verify', {
        method: 'POST',
        body: JSON.stringify({ message: messageChars, signature }),
      }).then(async (success) => setSuccess(await success.json()));

      verifySignature(messageChars, signature).then((success) => {
        setSignResOnClient(success);
      });
    });
  };
};

const generateEcdsa = (
  setServerMessage: Function,
  setClientPubKey: Function
): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/init');

    ws.onopen = () => {
      initGenerateEcdsaKey().then((success) => {
        if (success)
          step(null).then((firstMessage) => {
            ws.send(new Uint8Array(firstMessage).buffer);
          });
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      const receivedMessage = JSON.parse(message.data);

      if (receivedMessage === true) {
      }

      step(receivedMessage).then((nextMessage) => {
        ws.send(new Uint8Array(nextMessage).buffer);
      });
      setServerMessage(message.data);
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };

    ws.onclose = (event) => {
      console.log('closed', event);

      getPublicKey().then((pubKey) => {
        setClientPubKey(JSON.stringify(pubKey));
        res(true);
      });
    };
  });
};

const getApi = (protocoll: 'ws' | 'http'): string => {
  return `${protocoll}://127.0.0.1:8080/mpc/ecdsa`;
};
