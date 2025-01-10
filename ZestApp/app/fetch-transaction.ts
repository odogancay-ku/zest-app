import {WalletNetwork} from "@/constants/Enums";
import {TransactionHistory} from "@/models/models";
import {ethers} from "ethers";

const fetchTransactions = async (address: string, network: WalletNetwork) => {
    let url;
    try{
    if (network === WalletNetwork.Bitcoin) {
        //console.log("fetching transactions for bitcoin");
        url = `https://blockstream.info/testnet/api/address/${address}/txs`;
    } else if (network === WalletNetwork.Citrea) {
        //console.log("fetching transactions for citrea");
        url = `https://explorer.testnet.citrea.xyz/api/v2/addresses/${address}/transactions`

    }
    else if (network === WalletNetwork.Lightning) {
        url = '';
        return [];
    }
    else {
        throw new Error("Invalid network");
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    const response_json = await response.json();

    if (network === WalletNetwork.Bitcoin) {
        return response_json.map((tx: any): TransactionHistory => {

            const totalOutgoing = tx.vin
                .filter((vin: any) => vin.prevout.scriptpubkey_address === address)
                .reduce((acc: number, vin: any) => acc + vin.prevout.value, 0);

            const totalIncoming = tx.vout
                .filter((vout: any) => vout.scriptpubkey_address === address)
                .reduce((acc: number, vout: any) => acc + vout.value, 0);

            const amount = totalIncoming - totalOutgoing;

            return {
                id: tx.txid,
                date: tx.status.block_time,
                amount: (amount / 100000000).toString(), // Convert satoshis to BTC
                fee: (tx.fee / 100000000).toString(), // Convert satoshis to BTC
                status: tx.status.confirmed ? "Confirmed" : "Pending",
                senderWalletAddress: tx.vin[0]?.prevout.scriptpubkey_address || "Unknown",
                receiverWalletAddress: tx.vout[0]?.scriptpubkey_address || "Unknown",
            };

        });
    } else if (network === WalletNetwork.Citrea) {
        return response_json.items.map((tx: any): TransactionHistory => {
            return {
                id: tx.hash,
                date: tx.timestamp,
                amount: (tx.from.hash === address ? "-" : "") + ethers.formatEther(tx.value),
                fee: ethers.formatEther(tx.fee.value),
                status: tx.confirmations > 0 ? "Confirmed" : "Pending",
                senderWalletAddress: tx.from.hash,
                receiverWalletAddress: tx.to.hash
            };
        });
    }
    else if (network === WalletNetwork.Lightning) {
        return [];
    }
    }
    catch (error) {
        console.error("Error fetching transactions:", error,"for network:",network);
        return [];
    }

};

export {fetchTransactions};