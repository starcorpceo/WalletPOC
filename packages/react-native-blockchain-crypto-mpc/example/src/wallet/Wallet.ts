import type { IWallet, IWalletConfig } from "./";
import { getBalance, Balance, IBalance } from "../balance";

export class Wallet implements IWallet {
    config: IWalletConfig;
    balance: IBalance;

    constructor(config:IWalletConfig ) {
        this.config = config
        this.balance = new Balance(config.symbol, 0)
    }

    refreshBalance = async(): Promise<boolean> => {
        this.balance = await getBalance(this)
        return true;
    }
}