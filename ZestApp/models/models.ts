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

interface AddressInfo {
    address: string;
    chain_stats: TransactionStats;
    mempool_stats: TransactionStats;
}

interface TransactionStats {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
}

export { Wallet, WalletDisplay, WalletInfo, TransactionHistory,UTXOResponse,UTXO,AddressInfo,TransactionStats};