/**
 * Balance of a wallet
 *
 * @property {string} symbol Symbol: ex. BTC for Bitcoin - used as identifier
 * @function getValue() returns value of balance
 * @function getUnconfirmedBalance() Get unconfirmed Balance - balance which is not yet confirmed from miner - CAVE - not used because not returned by tatum
 * @function getConfirmedBalance() Get confirmed Balance - balance which is already confirmed from miner - CAVE - not used because not returned by tatum (only value is set)
 */

export interface IBalance {
    symbol: string,
    getValue(): number,
    getUnconfirmedBalance(): number,
    getConfirmedBalance(): number,
}