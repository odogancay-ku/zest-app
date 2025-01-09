import './shims';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import {BIP32Factory, BIP32Interface} from 'bip32';
import {Buffer} from 'buffer';
import axios from 'axios'
import {ethers} from "ethers";
import {WalletNetwork} from "@/constants/Enums";
import {AddressInfo, WalletInfo} from "@/models/models";

const bip32 = BIP32Factory(ecc);

//TODO: handle different networks
const network: bitcoin.Network = bitcoin.networks.testnet;

function createNewWallet() {
    const mnemonic: string = bip39.generateMnemonic();

    const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic);
    const root: BIP32Interface = bip32.fromSeed(seed, network);
    const keyPair: BIP32Interface = root.derivePath("m/44'/0'/0'/0/0");

    const pupKeyBuffer = Buffer.from(keyPair.publicKey)

    const {address = ''} = bitcoin.payments.p2wpkh({pubkey: pupKeyBuffer, network});
    const privateKey: string = keyPair.toWIF();


    let walletInfo: WalletInfo = {
        mnemonic: mnemonic,
        address: address,
        network: WalletNetwork.Bitcoin,
        privateKey: privateKey,
        publicKey: keyPair.publicKey.toString()
    }
    return walletInfo
}

function createNewWalletCitrea(): WalletInfo {
    const mnemonicStr: string = bip39.generateMnemonic();
    const wallet = ethers.Wallet.fromPhrase(mnemonicStr);

    let walletInfo: WalletInfo = {
        mnemonic: mnemonicStr,
        address: wallet.address,
        network: WalletNetwork.Citrea,
        privateKey: wallet.privateKey,
        publicKey: wallet.signingKey.publicKey
    };
    return walletInfo;
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
        network: WalletNetwork.Bitcoin,
        privateKey: privateKey,
        publicKey: keyPair.publicKey.toString()
    }
    return walletInfo
}

async function getEthWalletInfoFromPrivateKey(privateKey: string): Promise<WalletInfo> {
    // Ensure the private key is valid
    // if (!ethers.isHexString(privateKey, 32)) {
    //     throw new Error("Invalid private key.");
    // }
    //if not hex string, convert to hex string
    console.log("privateKey", privateKey);
    if (!privateKey.startsWith("0x")) {
        privateKey = `0x${privateKey}`;
    }

    const privateKeyBytes = ethers.hexlify(privateKey);

    // Create a wallet instance from the private key
    const wallet = new ethers.Wallet(privateKey);

    // Derive wallet information
    const address = wallet.address;
    const publicKey = wallet.address;

    return {
        mnemonic: "", // Mnemonic is not available when deriving from private key
        address: address,
        network: WalletNetwork.Citrea,
        privateKey: privateKey,
        publicKey: publicKey
    };
}

async function getEthWalletInfoFromMnemonic(mnemonic: string): Promise<WalletInfo> {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return  getEthWalletInfoFromPrivateKey(wallet.privateKey);
}

async function createLightningWallet(name:string): Promise<WalletInfo> {
    const lnbits_admin_key = "a972ea3f8f6d4a9282ed1b1ab08fd9e9";
    const node_apiUrl = "https://f5953107e2.d.voltageapp.io/api/v1";

    const url = node_apiUrl + '/wallet'; // Replace with your LNBits instance URL

    try {
        const response = await axios.post(
            url,
            {name: name}, // Wallet name
            {headers: {'X-Api-Key': lnbits_admin_key, 'Content-Type': 'application/json'}}
        );
        console.log('Wallet Created:', response.data);
        return {
            mnemonic: name,
            address: response.data.id,
            network: WalletNetwork.Lightning,
            privateKey: response.data.adminkey,
            publicKey: response.data.inkey
        };
    } catch (error:any) {
        console.error('Error creating wallet:', error.response?.data || error.message);
        alert("Error creating wallet");
        return {
            mnemonic: "",
            address: "",
            network: WalletNetwork.Lightning,
            privateKey: "",
            publicKey: ""
        }
    }
}

async function fetchBalance(address: string, network: WalletNetwork, apiKey?: string): Promise<number|any> {
    try {
        console.log("fetching balance for address", address, "and network", network);
        if(network === WalletNetwork.Bitcoin) {
            const response= await axios.get(`https://blockstream.info/testnet/api/address/${address}`);
            const data:AddressInfo = response.data;
            const remaining = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
            return remaining/100000000;
        } else if (network === WalletNetwork.Citrea) {
            const response = await axios.get(`https://explorer.testnet.citrea.xyz/api/v2/addresses/${address}`);
            return ethers.formatEther(response.data.coin_balance);
        }else if (network === WalletNetwork.Lightning) {
            const response = await axios.get(`https://f5953107e2.d.voltageapp.io/api/v1/wallet/`, {
                headers: {
                    "X-Api-Key": apiKey
                }
            });
            console.log("response last", response);
            const balance:number = response.data.balance;
            return balance / 100000000;
        }
    } catch (error) {
        console.error("Error fetching balance23:", error);
    }
}

const fetchBalanceFromPhase = async (mnemonicPhrase: string) => {
    const seed: Buffer = bip39.mnemonicToSeedSync(mnemonicPhrase);
    const root: BIP32Interface = bip32.fromSeed(seed, network);
    const keyPair: BIP32Interface = root.derivePath("m/44'/0'/0'/0/0");
    const pupKeyBuffer = Buffer.from(keyPair.publicKey)
    const {address} = bitcoin.payments.p2wpkh({pubkey: pupKeyBuffer, network});
    if (address != null) {
        return await fetchBalance(address, WalletNetwork.Bitcoin);
    }
    return -1
}

export {generateMnemonic,createNewWallet, getWalletInfoMnemonic, fetchBalance, createLightningWallet,fetchBalanceFromPhase, getEthWalletInfoFromPrivateKey, getEthWalletInfoFromMnemonic,}

/* Generated Address Wallet 1 BTC
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

/* Wallet 2 BTC
mnemonic: custom ocean hint deal style amused pyramid bitter canal draw steak indoor
tb1qqxqe6f08zsjz8j54duhwcfphctwq6qxunjmtpq
 */


/* Wallet 3 cBTC
0xEda026247a58aFca8B98cEE391e7D72c25BC5A09
68f0850abe026c4020804d32a0d3aa322f9097f3abcdda58ccec7bc1ca534964
 */