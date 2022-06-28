import { Buffer } from 'buffer';
import {
  getSignature,
  initSignEcdsa,
  step,
  verifySignature,
} from 'react-native-blockchain-crypto-mpc';
import { ActionStatus, getApi } from './shared';

export const signEcdsa = (
  setSuccess: Function,
  setSignResOnClient: Function
) => {
  const ws = new WebSocket(getApi('ws') + '/sign');
  let signStatus: ActionStatus = 'Init';

  const stringToSign = 'Hello World';
  const bufferToSign = Buffer.from(stringToSign);
  const messageChars = [...bufferToSign];

  ws.onopen = () => {
    ws.send(bufferToSign);
  };

  ws.onmessage = (message: WebSocketMessageEvent) => {
    switch (signStatus) {
      case 'Init':
        const msg = JSON.parse(message.data);

        if (msg.value !== 'Start') {
          return;
        }

        signStatus = 'Stepping';

        initSignEcdsa(messageChars).then((success) => {
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
