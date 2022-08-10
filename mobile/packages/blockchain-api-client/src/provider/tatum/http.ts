import { fetchFrom, HttpParams } from '../../base/http';
import { Network } from '../../base/types';

export const fetchFromTatum = async <T>(url: string, network: Network, params?: HttpParams): Promise<T> => {
  return fetchFrom(url, {
    ...params,
    args: {
      ...params?.args,
      headers: {
        ...params?.args?.headers,
        'x-api-key': network === 'MAIN' ? apiKeys.main : apiKeys.test,
      },
    },
  });
};

const apiKeys = {
  test: '89156412-0b04-4ed1-aede-d4546b60697c',
  main: '4d706557-f378-4242-b57f-78b368df0fc2',
};
