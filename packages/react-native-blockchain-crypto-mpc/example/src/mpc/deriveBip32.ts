/**
 * Deriving a wallet based on previous seed
 */

import { initDeriveBIP32, step, getResultDeriveBIP32, getPublicKey } from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const deriveBIP32 = (): Promise<any> => {
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

      getResultDeriveBIP32().then((success) => {
        success && getPublicKey().then((key) => {
          res( key )
        })
      });
    };
  });
};