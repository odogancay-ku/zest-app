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

export { Wallet ,WalletInfo};