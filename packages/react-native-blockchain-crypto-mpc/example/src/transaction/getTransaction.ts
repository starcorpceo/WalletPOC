/**
 * Recieving transaction data of address from external api
 *
 * @param {IWallet} wallet Wallet object with address and symbol (determines which api to use)
 */

import type { IWallet } from '../wallet';
import apikeys from '../general/apikeys';
import transactionEndpoints from './transactionEndpoints';
import type { ITransaction } from './';

export const getLatestTransactions = (
  wallet: IWallet,
  pageSize: number = 10,
  offset: number = 0
): Promise<ITransaction[]> => {
  return new Promise(async (res) => {
    const query = new URLSearchParams({
      pageSize: pageSize.toString(),
      offset: offset.toString(),
    }).toString();

    const fetched = await fetch(
      transactionEndpoints[wallet.config.symbol.toLowerCase()] +
        wallet.config.address +
        '?' +
        query.toString(),
      {
        method: 'GET',
        headers: {
          'x-api-key': apikeys.tatum,
        },
      }
    );

    const content = await fetched.text();
    const transactions: ITransaction[] = JSON.parse(content);

    res(transactions);
  });
};
