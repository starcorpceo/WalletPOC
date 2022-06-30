// ToDo's
// derive not only from bitcoin
// derive several wallets

import Elliptic from 'elliptic';
import { deriveBIP32, generateSecret, importSecret } from "../mpc";
import '../../shim';
import { Wallet, IWalletConfig } from "../wallet";
import * as bitcoin from 'bitcoinjs-lib';
const ec = new Elliptic.ec('secp256k1');
const TESTNET = bitcoin.networks.testnet;

export const generateWalletFromSeed = (seed: string): Promise<Wallet> => {
    return new Promise(async (res) => {
        console.log("generating wallet from seed " + seed.slice(0,5),"...")
        await importSecret(seed, (seedShare: string) =>
            console.log('Seed share', Buffer.from(seedShare).toString('hex').slice(0,5)+"...")
        );
        res(await derive())
    })
};

export const generateWallet = (): Promise<any> => {
    return new Promise(async (res) => {
        console.log("generating new wallet...")
        await generateSecret((seedShare: string) =>
            console.log('Seed share', Buffer.from(seedShare).toString('hex').slice(0,5)+"...")
        );
        res(await derive())
    });
};

const derive = async ():Promise<Wallet> => {
    return new Promise(async (res) => {
        const pubKeyDER = await deriveBIP32()

        const ECPairFrompubKeyDer = ec.keyFromPublic(pubKeyDER.slice(23));
        const pubkeyBuf = Buffer.from(ECPairFrompubKeyDer.getPublic().encode('hex', false), 'hex');
        const pubkeyECPair = bitcoin.ECPair.fromPublicKey(pubkeyBuf);

        //ToDo -----------------------------------------------------
        //bitcoin specific, needs to be changed for other chains
        //ToDo -----------------------------------------------------
        const { address } = bitcoin.payments.p2pkh({
            pubkey: pubkeyECPair.publicKey,
            network: TESTNET,
        });

        //ToDo -----------------------------------------------------
        //bitcoin hardcoded, has to be dynamically
        //ToDo -----------------------------------------------------
        const walletConfig: IWalletConfig = {
            symbol:"BTC",
            name:"Bitcoin",
            chain:"Bitcoin",
            address:address,
            publicKey:pubkeyECPair.publicKey,
            isTestnet:true,
        }
        res(new Wallet(walletConfig))
    })
};