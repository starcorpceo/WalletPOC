import type { IBalance } from "./";

export class Balance implements IBalance {
    symbol: string = '';
    value = 0;
    unconfirmedBalance = 0;
    confirmedBalance = 0;

    
    constructor(symbol: string, balance: number) {
        this.symbol=symbol;
        this.value=balance;
    }
    getSymbol(): string {
        return this.symbol;
    }
    getValue(): number {
        return this.value;
    }
    getUnconfirmedBalance(): number {
        return this.unconfirmedBalance;
    }
    getConfirmedBalance(): number {
        return this.confirmedBalance;
    }

}