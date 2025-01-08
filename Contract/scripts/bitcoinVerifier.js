// bitcoinVerifier.js
const axios = require("axios");
const bitcoin = require("bitcoinjs-lib");

class BitcoinVerifier {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }


    async verifyTransaction(txid, ownerAddress, amount) {

        const status = await axios
            .get(`${this.apiUrl}/tx/${txid}/status`)
            .then((r) => r.data);

        if (!status.confirmed) {
            console.log("Transaction not confirmed yet");
            return { isVerified: false, recipient: "" };
        }

        const transaction = await axios
            .get(`${this.apiUrl}/tx/${txid}`)
            .then((r) => r.data);

        const btcToSatoshis = (btcAmount) => btcAmount * 100_000_000;
        const convertedAmount = btcToSatoshis(amount);
        console.log(convertedAmount);
        const hasMatchingOutput = transaction.vout.some((vout) => {
            console.log(vout.scriptpubkey_address, ownerAddress, vout.value, convertedAmount);
            return vout.scriptpubkey_address === ownerAddress && vout.value === convertedAmount;
        });
        10000
        if (!hasMatchingOutput) {
            console.log("Transaction does not match the expected output");
            return { isVerified: false, recipient: "" };
        }

        const rawTx = await axios
            .get(`${this.apiUrl}/tx/${txid}/hex`)
            .then((r) => r.data);

        const opReturnData = this.getOpReturnData(rawTx);
        return { isVerified: true, recipient: opReturnData };
    }

    getOpReturnData(rawTx) {
        const tx = bitcoin.Transaction.fromHex(rawTx);

        for (const output of tx.outs) {
            const asm = bitcoin.script.toASM(output.script);
            if (asm.startsWith("OP_RETURN")) {
                return asm.split(" ")[1];
            }
        }
        return "";
    }
}

module.exports = { BitcoinVerifier };
