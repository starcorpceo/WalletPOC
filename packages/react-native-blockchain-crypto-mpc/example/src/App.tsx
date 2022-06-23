import * as React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {
  getPublicKey,
  getSignature,
  initGenerateEcdsaKey,
  initGenerateGenericSecret,
  initSignEcdsa,
  getSeedShare,
  step,
  verifySignature,
  importGenericSecret,
  initDeriveBIP32,
} from 'react-native-blockchain-crypto-mpc';

import { Buffer } from 'buffer';

export default function App() {
  const [serverMessage, setServerMessage] = React.useState<
    string | undefined
  >();
  const [clientPubKey, setClientPubKey] = React.useState<any | undefined>();
  const [seedShare, setSeedShare] = React.useState<any | undefined>();

  const [signSuccess, setSignSuccess] = React.useState<boolean>();
  const [signResOnClient, setSignResOnClient] = React.useState<boolean>();

  const [secret, setSecret] = React.useState<string>();
  const [xPub, setxPub] = React.useState<any>();

  /*React.useEffect(() => {
    const doit = async () => {
      await importSecret(secret, setServerMessage);
      //await generateSecret(setServerMessage, setSeedShare);
      //await generateEcdsa(setServerMessage, setClientPubKey);
      //await signEcdsa(setSignSuccess, setSignResOnClient);
    };

    doit();
  }, []);*/

  const importSecretOnPress = async () => {
    console.log("hex: ", secret);
    await importSecret(secret!, setServerMessage);
  }

  const deriveBIPMaster = async () => {
    console.log("derive master");
    await deriveBIP32(setxPub);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Hex Seed:</Text>
        <TextInput style={styles.input} onChangeText={setSecret}></TextInput>
        <Button onPress={importSecretOnPress} title="Import now">Import now</Button>

        <Button onPress={deriveBIPMaster} title="Derive"></Button>
        <Text>xPub: {JSON.stringify(xPub)}</Text>
        {/*<Text>Result generic secret: {JSON.stringify(seedShare)}</Text>
        <Text>Result init client: {JSON.stringify(serverMessage)}</Text>
        <Text>Pub key client: {JSON.stringify(clientPubKey)}</Text>
        <Text>Signature verified by Server: {JSON.stringify(signSuccess)}</Text>
        <Text>
          Signature verified by Client: {JSON.stringify(signResOnClient)}
        </Text>*/}
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
    width:280,
    height: 30,
    backgroundColor: 'grey'
  }
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
      console.log('Start generate ecdsa key');
      initGenerateEcdsaKey().then((success) => {
        if (success)
          step(null).then((firstMessage) => {
            ws.send(new Int8Array(firstMessage).buffer);
          });
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      const receivedMessage = JSON.parse(message.data);

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

const generateSecret = (
  setServerMessage: Function,
  setSeedShare: Function
): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/secret');

    ws.onopen = () => {
      initGenerateGenericSecret().then((success) => {
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
      getSeedShare().then((share) => {
        setSeedShare(JSON.stringify(share));
        res(true);
      });
      //const seed1 = c1.getNewShare();
    };
  });
};

const importSecret = (
  secret: string,
  setSeedShare: Function
): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/import');

    const secretBuffer = Buffer.from(secret, 'hex');
    const secretChars = [...secretBuffer];

    ws.onopen = () => {
      importGenericSecret(secretChars).then((success) => {
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
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };

    ws.onclose = (event) => {
      console.log('closed', event);
      getSeedShare().then((share) => {
        setSeedShare(JSON.stringify(share));
        res(true);
      });
    };
  });
};

const deriveBIP32 = (
  setXPubKeyShare: Function
): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/derive');

    ws.onopen = () => {
      initDeriveBIP32().then((success) => {
        if (success)
          step(null).then((firstMessage) => {
            ws.send(new Uint8Array(firstMessage).buffer);
          });
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      const receivedMessage = JSON.parse(message.data);

      

      console.log("on Message client");

      /*if (receivedMessage === true) {
      }*/

      //console.log("rec: ", receivedMessage.length);

      step(receivedMessage).then((nextMessage) => {
        console.log("next: ", nextMessage.length);
        ws.send(new Uint8Array(nextMessage).buffer);
      });
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };

    ws.onclose = (event) => {
      console.log('closed', event);
      getPublicKey().then((pubKey) => {
        setXPubKeyShare(JSON.stringify(pubKey));
        res(true);
      });
    };
  });
};

const getApi = (protocoll: 'ws' | 'http'): string => {
  const localIp = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

  return `${protocoll}://${localIp}:8080/mpc/ecdsa`;
};
