import "./shims";
import ECPairFactory from 'ecpair';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import {BIP32Factory, BIP32Interface} from 'bip32';
import { Buffer } from 'buffer';

async function generateKey() {
    console.log("started")
    const bip32 = BIP32Factory(ecc);
    const mnemonic: string = bip39.generateMnemonic();
    console.log("Mnemonic: ", mnemonic);

    const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic);
    const network: bitcoin.Network = bitcoin.networks.testnet;
    const root:BIP32Interface  = bip32.fromSeed(seed, network);
    const keyPair: BIP32Interface = root.derivePath("m/44'/0'/0'/0/0");

    const pupKeyBuffer = Buffer.from(keyPair.publicKey)

    const { address } = bitcoin.payments.p2wpkh({ pubkey: pupKeyBuffer, network });
    const privateKey: string = keyPair.toWIF();
    console.log("Public key: ", keyPair.publicKey.toString());
    console.log("Address: ", address);
    console.log("Private key: ", privateKey);
}

export default generateKey;
