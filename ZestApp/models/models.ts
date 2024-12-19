interface Wallet {
    id: string;
    name: string;
    network: string;
    privateKey: string;
    address: string;
    publicKey: string;
}


interface WalletDisplay {
    id: string;
    name: string;
    network: string;
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

export { Wallet, WalletDisplay, WalletInfo, TransactionHistory};