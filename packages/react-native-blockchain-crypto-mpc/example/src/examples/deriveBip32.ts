import { initDeriveBIP32, step } from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const deriveBIP32 = (setXPubKeyShare: Function): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/derive');

    ws.onopen = () => {
      initDeriveBIP32().then((success) => {
        console.log('starting steps for derive');
        success && step(null).then((stepMsg) => ws.send(stepMsg));
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      console.log('derive messag from server');
      step(message.data).then((stepMsg) => ws.send(stepMsg));
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };

    ws.onclose = (event) => {
      console.log('closed', event);
      // getPublicKey().then((pubKey) => {
      setXPubKeyShare('pub key should be available');
      res(true);
      // });
    };
  });
};
