import {
  getPublicKey,
  initGenerateEcdsaKey,
  step,
} from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const generateEcdsa = (
  setServerMessage: Function,
  setClientPubKey: Function
): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/init');

    ws.onopen = () => {
      console.log('Start generate ecdsa key');
      initGenerateEcdsaKey().then((success) => {
        if (success) step(null).then((stepMsg) => ws.send(stepMsg));
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      step(message.data).then((stepMsg) => ws.send(stepMsg));
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
