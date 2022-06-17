import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { initGenerateEcdsaKey, step } from 'react-native-blockchain-crypto-mpc';

export default function App() {
  const [resultInitClient, setResultInitClient] = React.useState<
    number[] | undefined
  >();
  const [resultInitServer, setResultInitServer] = React.useState<
    number[] | undefined
  >();

  const [resultClientStep2, setResultClientStep2] = React.useState<
    number[] | undefined
  >();

  React.useEffect(() => {
    const doit = async () => {
      const firstMessage = await initGenerateEcdsaKey();

      console.log(JSON.stringify(firstMessage));

      setResultInitClient(firstMessage);

      const response = await fetch(
        'http://localhost:8080/initGenerateEcdsaKey',
        {
          method: 'POST',
          body: JSON.stringify({ message: firstMessage }),
        }
      );

      const serverInit = await response.json();

      console.log('respone', serverInit);

      setResultInitServer(serverInit);

      const clientStep2 = await step(serverInit);
      setResultClientStep2(clientStep2);
    };

    doit();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Result init client: {JSON.stringify(resultInitClient)}</Text>
        <Text>Result init server: {JSON.stringify(resultInitServer)}</Text>
        <Text>Result client step 2: {JSON.stringify(resultClientStep2)}</Text>
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
