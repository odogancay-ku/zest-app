import './shims';
import axios from "axios";
import * as Bitcoin from 'bitcoinjs-lib'
import {Wallet} from "@/models/models";
import {PsbtInputExtended} from "bip174/src/lib/interfaces";

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

async function makeTransaction(wallet: Wallet, value: string, receiverWalletAddress: string) {

    if (!wallet) {
            alert("Wallet not selected or doesn't exist.");
            return;
        }

        const { address, privateKey } = wallet;

        try {
            // Fetch UTXOs
            const utxoResponse:UTXOResponse = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`);
            const utxos = utxoResponse.data;

            if (utxos.length === 0) {
                alert("No UTXOs found for this wallet.");
                return;
            }

            // Prepare Transaction
            const network = Bitcoin.networks.testnet; // Use testnet for testing
            const txb = new Bitcoin.Psbt({ network });

            //TODO: handle different networks, non-segwit addresses
            const script = Bitcoin.address.toOutputScript(address, network);

            let inputAmount = 0;
            for (let utxo of utxos) {
                const inputData: PsbtInputExtended = {
                    hash: utxo.txid,
                    index: utxo.vout,
                    value: utxo.value,
                    witnessUtxo: {
                        script: script,
                        value: utxo.value
                    }
                }
                txb.addInput(inputData);
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
            txb.addOutput({
                address: receiverWalletAddress,
                value: amountToSend,
            });

            txb.addOutput({
                address: address,
                value: change,
            })

            // Sign the inputs
            const keyPair = Bitcoin.ECPair.fromWIF(privateKey, network);
            for (let i = 0; i < utxos.length; i++) {
                txb.signInput(i, keyPair);
            }
            txb.finalizeAllInputs();

            // Build the raw transaction
            const rawTx = txb.extractTransaction().toHex();
            console.log("Raw Transaction:", rawTx);

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