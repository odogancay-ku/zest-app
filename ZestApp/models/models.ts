interface Wallet {
    id: string;
    name: string;
    network: string;
    privateKey: string;
    address: string;
    publicKey: string;
}
interface WalletInfo{
    mnemonic: string,
    address: string,
    privateKey: string,
    publicKey: string
}

export { Wallet ,WalletInfo};