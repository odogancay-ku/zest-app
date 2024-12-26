import {WalletNetwork} from "@/constants/Enums";

interface Wallet {
    id: string;
    name: string;
    network: WalletNetwork;
    privateKey: string;
    address: string;
    publicKey: string;
    balance: number;
}


interface WalletDisplay {
    id: string;
    name: string;
    network: WalletNetwork;
    address: string;
    balance: number;
}

interface WalletInfo{
    mnemonic: string,
    address: string,
    privateKey: string,
    publicKey: string
}

interface TransactionHistory {
    id: number;
    walletId: string;
    amount: number;
    date: string;
    type: string;
}
interface UTXO {
    txid: string;
    vout: number;
    value: number;
    status: {
        confirmed: boolean;
        block_height: number;
        block_hash: string;
        block_time: number;
    }
}

interface UTXOResponse {
    data: UTXO[];
}

export { Wallet, WalletDisplay, WalletInfo, TransactionHistory,UTXOResponse,UTXO};