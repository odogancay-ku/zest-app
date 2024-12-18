import './shims';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import {BIP32Factory, BIP32Interface} from 'bip32';
import {Buffer} from 'buffer';
import axios from 'axios'
import {WalletInfo} from "@/models/models";

const bip32 = BIP32Factory(ecc);

//TODO: handle different networks
const network: bitcoin.Network = bitcoin.networks.testnet;

function createNewWallet() {
    const mnemonic: string = bip39.generateMnemonic();
    console.log("Mnemonic: ", mnemonic);

    const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic);
    const root: BIP32Interface = bip32.fromSeed(seed, network);
    const keyPair: BIP32Interface = root.derivePath("m/44'/0'/0'/0/0");

    const pupKeyBuffer = Buffer.from(keyPair.publicKey)

    const {address = ''} = bitcoin.payments.p2wpkh({pubkey: pupKeyBuffer, network});
    const privateKey: string = keyPair.toWIF();

    console.log("Public key: ", keyPair.publicKey.toString());
    console.log("Address: ", address);
    console.log("Private key: ", privateKey);

    let walletInfo: WalletInfo = {
        mnemonic: mnemonic,
        address: address,
        privateKey: privateKey,
        publicKey: keyPair.publicKey.toString()
    }
    return walletInfo
}


function generateMnemonic() {
    return bip39.generateMnemonic();
}

async function getWalletInfoMnemonic(mnemonicPhrase: string) {
    const seed: Buffer = bip39.mnemonicToSeedSync(mnemonicPhrase);
    const root: BIP32Interface = bip32.fromSeed(seed, network);
    const keyPair: BIP32Interface = root.derivePath("m/44'/0'/0'/0/0");
    const pupKeyBuffer = Buffer.from(keyPair.publicKey)
    const {address = ''} = bitcoin.payments.p2wpkh({pubkey: pupKeyBuffer, network});
    const privateKey: string = keyPair.toWIF();
    let walletInfo: WalletInfo = {
        mnemonic: mnemonicPhrase,
        address: address,
        privateKey: privateKey,
        publicKey: keyPair.publicKey.toString()
    }
    return walletInfo
}

async function fetchBalance(address: string) {
    try {
        console.log("Fetching balance for address:", address)
        const response = await axios.get(`https://blockstream.info/testnet/api/address/${address}`);
        console.log("Balance:", response.data.chain_stats.funded_txo_sum / 100000000);
        return response.data.chain_stats.funded_txo_sum / 100000000;
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

const fetchBalanceFromPhase = async (mnemonicPhrase: string) => {
    const seed: Buffer = bip39.mnemonicToSeedSync(mnemonicPhrase);
    const root: BIP32Interface = bip32.fromSeed(seed, network);
    const keyPair: BIP32Interface = root.derivePath("m/44'/0'/0'/0/0");
    const pupKeyBuffer = Buffer.from(keyPair.publicKey)
    const {address} = bitcoin.payments.p2wpkh({pubkey: pupKeyBuffer, network});
    if (address != null) {
        return await fetchBalance(address);
    }
    return -1
}

export {generateMnemonic,createNewWallet, getWalletInfoMnemonic, fetchBalance, fetchBalanceFromPhase}

/* Generated Address
Mnemonic:  praise valley time inject leg vintage burst bottom unfair luggage mixed level
Seed:  a2a60bdf1cfd5278c206ec9d7bd628ebe4a79dd8130841ecd0b20b4636b129fd88c33abf61d93d8ad564f787cab96034004be19a79bbfc9f8c9b955a7d12f3e4
Root:  tprv8ZgxMBicQKsPdBEXp8UxdafPaVwBejRXfP8oUuuQ2A8HzqR42s6mn6zv1JXU4d8GhK4DhQsZpKQN9fTymXJA6YtRxhSFaVPRLR12KQqPvc5
Public key:  3,105,187,86,51,111,16,52,238,31,19,112,63,49,226,48,122,47,170,242,154,232,20,29,83,53,46,60,101,72,155,172,167
Public key buffer:  0369bb56336f1034ee1f13703f31e2307a2faaf29ae8141d53352e3c65489baca7
Address:  tb1qcmqkn0y7lvft2rsutat8d5aay93xyxsnv4l2xh
Private key:  cQiNvLH95kBN3pcqMuEMFWvEJm9Zis5XKLwWxTUEzUvh21WMHJn7
*/

/* Refund to here
tb1qerzrlxcfu24davlur5sqmgzzgsal6wusda40er
 */