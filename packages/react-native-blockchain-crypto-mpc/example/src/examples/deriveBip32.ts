import { initDeriveBIP32, step, getResultDeriveBIP32, getPublicKey, getShare } from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';
import {Buffer} from "buffer"

export const deriveBIP32 = (setXPubKeyShare: Function, setShare: Function): Promise<any> => {
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
        success && getShare().then((share) => {
          setShare(Buffer.from(share).toString('hex'));
        });
        success && getPublicKey().then((key) => {
          setXPubKeyShare(Buffer.from(key).toString('hex'));
        })
      });
      res(true);
    };
  });
};