import './shims';
import axios from "axios";
import * as Bitcoin from 'bitcoinjs-lib'
import {UTXOResponse, Wallet} from "@/models/models";
import {PsbtInputExtended} from "bip174/src/lib/interfaces";
import {WalletNetwork} from "@/constants/Enums";
import {ethers} from "ethers";


async function makeTransaction(wallet: Wallet, value: string, receiverWalletAddress: string, customData: string) {
    if (!wallet) {
        alert("Wallet not selected or doesn't exist.");
        return;
    }

    if (wallet.network === WalletNetwork.Citrea) {
        await sendTransactionCitrea(wallet, receiverWalletAddress, value);
        return;
    }

    const {address, privateKey} = wallet;

    try {
        console.log("address is :", address)
        // Fetch UTXOs
        const utxoResponse: UTXOResponse = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`);
        const utxos = utxoResponse.data;

        if (utxos.length === 0) {
            alert("No UTXOs found for this wallet.");
            return;
        }

        // Prepare Transaction
        const network = Bitcoin.networks.testnet; // Use testnet for testing
        const txb = new Bitcoin.Psbt({network});

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
        value = value.replace(",", ".");
        const amountToSend = Math.floor(parseFloat(value) * 1e8); // Convert BTC to satoshis
        console.log(amountToSend)
        const fee = 10000; // Fee in satoshis
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


        if (customData) {
            if (customData.startsWith("0x")) {
                customData = customData.slice(2);
            }
            console.log("Custom Data:", customData);
            const data = Buffer.from(customData, 'hex');
            const embed = Bitcoin.script.compile([
                Bitcoin.opcodes.OP_RETURN,
                data
            ])
            txb.addOutput({
                script: embed,
                value: 0
            })
        }

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
            headers: {"Content-Type": "text/plain"},
        });

        alert(`Transaction sent! Txid: ${broadcastResponse.data}`);
    } catch (error: any) {
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
}

async function sendTransactionCitrea(connectedWallet: Wallet, receiver: string, value: string) {
    if (!connectedWallet) {
        alert("Wallet not selected or doesn't exist.");
        return;
    }

    let ethersWallet = new ethers.Wallet(connectedWallet.privateKey);
    const provider = new ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
    ethersWallet = ethersWallet.connect(provider);
    value = value.replace(",", ".");
    await ethersWallet.sendTransaction({
        to: receiver,
        value: ethers.parseEther(value)
    });
    console.log("Transaction sent!");
    alert("Transaction sent!");
    return;
}


export {makeTransaction};