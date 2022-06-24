import {
  getShare,
  initGenerateGenericSecret,
  step,
} from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const generateSecret = (
  setServerMessage: Function,
  setSeedShare: Function
): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/secret');

    ws.onopen = () => {
      initGenerateGenericSecret().then((success) => {
        success && step(null).then((stepMsg) => ws.send(stepMsg));
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
      getShare().then((share) => {
        setSeedShare(JSON.stringify(share));
        res(true);
      });
      //const seed1 = c1.getNewShare();
    };
  });
};
