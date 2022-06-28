import { Buffer } from 'buffer';
import {
  getShare,
  importGenericSecret,
  step,
} from 'react-native-blockchain-crypto-mpc';
import { ActionStatus, getApi } from './shared';

export const importSecret = (
  secret: string,
  setSeedShare: Function
): Promise<any> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/import');
    let importStatus: ActionStatus = 'Init';

    const secretBuffer = Buffer.from(secret, 'hex');
    const secretChars = [...secretBuffer];

    ws.onopen = () => {
      ws.send(secretBuffer);
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      switch (importStatus) {
        case 'Init':
          const msg = JSON.parse(message.data);

          if (msg.value !== 'Start') {
            return;
          }

          importStatus = 'Stepping';

          importGenericSecret(secretChars).then((success) => {
            success && step(null).then((stepMsg) => ws.send(stepMsg));
          });
          break;
        case 'Stepping':
          step(message.data).then((stepMsg) => ws.send(stepMsg));
          break;
      }
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
