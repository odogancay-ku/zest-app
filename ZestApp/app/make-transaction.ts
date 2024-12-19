import './shims';
import axios from "axios";
import * as Bitcoin from 'bitcoinjs-lib'
import {Wallet} from "@/models/models";

async function makeTransaction(wallet: Wallet, value: string, receiverWalletAddress: string) {
        if (!wallet) {
            alert("Wallet not selected or doesn't exist.");
            return;
        }

        const { address, privateKey } = wallet;

        try {
            // Fetch UTXOs
            const utxoResponse = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`);
            const utxos = utxoResponse.data;

            if (utxos.length === 0) {
                alert("No UTXOs found for this wallet.");
                return;
            }



            // Prepare Transaction
            const network = Bitcoin.networks.testnet; // Use testnet for testing
            const txb = new Bitcoin.TransactionBuilder(network);
            let inputAmount = 0;

            // Add UTXOs as inputs
            for (let utxo of utxos) {
                txb.addInput(utxo.txid, utxo.vout);
                inputAmount += utxo.value;
            }

            // Amounts in satoshis
            const amountToSend = Math.floor(parseFloat(value) * 1e8); // Convert BTC to satoshis
            const fee = 1000; // Fee in satoshis
            const change = inputAmount - amountToSend - fee;

            if (change < 0) {
                alert("Insufficient funds.");
                return;
            }

            // Add output to the receiver
            txb.addOutput(receiverWalletAddress, amountToSend);

            // Add change output back to the sender
            txb.addOutput(address, change);

            // Sign the inputs
            const keyPair = Bitcoin.ECPair.fromWIF(privateKey, network);
            for (let i = 0; i < utxos.length; i++) {
                txb.sign(i, keyPair);
            }

            // Build the raw transaction
            const rawTx = txb.build().toHex();
            console.log("Raw Transaction:", rawTx);

            console.log("b")
            // Broadcast the transaction
            const broadcastResponse = await axios.post("https://blockstream.info/testnet/api/tx", rawTx, {
                headers: { "Content-Type": "text/plain" },
            });

            alert(`Transaction sent! Txid: ${broadcastResponse.data}`);
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                console.error("HTTP Status:", error.response.status);
                console.error("Response Body:", error.response.data);
                alert(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            } else {
                // Handle other errors (e.g., network errors)
                alert("An error occurred while creating or broadcasting the transaction.");
            }
        }
    };

export {makeTransaction};