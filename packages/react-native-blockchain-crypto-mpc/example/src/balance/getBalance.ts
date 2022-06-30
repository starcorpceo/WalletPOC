/**
 * Recieving balance data of address from external api
 *
 * @param {IWallet} wallet Wallet object with address and symbol (determines which api to use)
 */

import type { IWallet } from "../wallet";
import { Balance, IBalance } from "./";
import apikeys from "../general/apikeys";
import balanceEndpoints from "./balanceEndpoints";

export const getBalance = (wallet: IWallet): Promise<IBalance> => {
    return new Promise(async (res) => {
        const fetched = await fetch(balanceEndpoints[wallet.config.symbol.toLowerCase()] + wallet.config.address, {
            method: 'GET',
            headers: {
                'x-api-key': apikeys.tatum,
            },
        })

        const content = await fetched.text()
        const balance = JSON.parse(content).incoming
        const test = new Balance(wallet.config.symbol, balance)
        res(test);
    })
};