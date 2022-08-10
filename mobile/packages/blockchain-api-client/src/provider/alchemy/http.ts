import { fetchFrom } from '../../base/http';

export const fetchFromAlchemy = async <T>(url: string, method: Method, params?: any[]): Promise<T> => {
  console.log(url + apiKey, { body: { id: 1, jsonrpc: '2.0', params, method } });
  return fetchFrom(url + apiKey, { body: { id: 1, jsonrpc: '2.0', params, method } });
};

export enum Method {
  Balance = 'eth_getBalance',
  Transactions = 'alchemy_getAssetTransfers',
  SendTransaction = 'eth_sendRawTransaction',
}

const apiKey = 'ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0';
