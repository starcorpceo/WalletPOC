/**
 * The configuration of a wallet
 *
 * @export
 * @interface IWalletConfig
 * @property {null|string} symbol Official symbol
 * @property {null|string} name Display name
 * @property {string} chain Blockchain type
 * @property {boolean} isTestnet Wether if its testnet or not
 * @property {null|string} address The wallet address for this chain
 * @property {null|string} publicKey The public Key in base58
 */

export interface IWalletConfig {
    symbol: string;
    name: null | string;
    chain: string;
    address: string | undefined;
    publicKey: null | Buffer;
    isTestnet: boolean;
}