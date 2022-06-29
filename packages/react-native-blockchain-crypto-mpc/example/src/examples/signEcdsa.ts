import { Buffer } from 'buffer';
import {
  getSignature,
  initSignEcdsa,
  step,
} from 'react-native-blockchain-crypto-mpc';
import { ActionStatus, getApi } from './shared';

export const signEcdsa = (message: Buffer): Promise<Buffer> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/sign');
    let signStatus: ActionStatus = 'Init';

    const messageChars = [...message];

    ws.onopen = () => {
      ws.send(message);
    };

    ws.onmessage = (wsMessage: WebSocketMessageEvent) => {
      switch (signStatus) {
        case 'Init':
          const msg = JSON.parse(wsMessage.data);

          if (msg.value !== 'Start') {
            return;
          }

          signStatus = 'Stepping';

          initSignEcdsa(messageChars).then((success) => {
            success && step(null).then((stepMsg) => ws.send(stepMsg));
          });

          break;
        case 'Stepping':
          step(wsMessage.data).then((stepMsg) => ws.send(stepMsg));
          break;
      }
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };

    ws.onclose = (event) => {
      console.log('closed', event);

      getSignature().then((signature) => {
        res(Buffer.from(signature));
        // fetch(getApi('http') + '/verify', {
        //   method: 'POST',
        //   body: JSON.stringify({ message: messageChars, signature }),
        // }).then(async (success) => setSuccess(await success.json()));

        // verifySignature(messageChars, signature).then((success) => {
        //   res(signature);
        // });
      });
    };
  });
};
