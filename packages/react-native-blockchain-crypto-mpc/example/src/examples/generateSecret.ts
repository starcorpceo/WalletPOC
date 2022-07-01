/**
 * Generating an random MPC seed(secret) for deriving later
 *
 * @param {Function} setSeedShare Function to return the client side seed share
 */

import {
  getShare,
  initGenerateGenericSecret,
  step,
} from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const generateSecret = (setSeedShare: Function): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/secret');

    ws.onopen = () => {
      initGenerateGenericSecret().then((success) => {
        success && step(null).then((stepMsg) => ws.send(stepMsg));
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      step(message.data).then((stepMsg) => ws.send(stepMsg));
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };

    ws.onclose = (event) => {
      console.log('closed', event);
      getShare().then((share) => {
        setSeedShare(JSON.stringify(share));
        res(true);
      });
    };
  });
};
