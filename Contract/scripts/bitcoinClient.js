const { BitcoinVerifier } = require('./bitcoinVerifier');
const hre = require("hardhat");
const {ethers} = require("ethers");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const atomicSwapAddress = '0x181A33a656E3457AfF24c679D7Ba35bb3d18f8e0';
const provider = new hre.ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
const wallet = new hre.ethers.Wallet(privateKey, provider);
const contractABI = require('../artifacts/contracts/AtomicSwap.sol/AtomicSwap.json').abi;
const swapContract = new hre.ethers.Contract(atomicSwapAddress, contractABI, wallet);

async function mockVerifyTransaction(txid, owner, amount) {
    console.log('Verifying transaction:', { txid, owner, amount });
    const verifier = new BitcoinVerifier('https://blockstream.info/testnet/api');
    try {
        return await verifier.verifyTransaction(txid, owner, amount);
    } catch (error) {
        console.error('Error in mockVerifyTransaction:', error);
        return { isVerified: false };
    }
}

async function listenForVerificationRequests() {
    console.log('Starting to poll for VerificationRequested events...');
    const filter = swapContract.filters.VerificationRequested();

    let lastBlock = await provider.getBlockNumber();

    setInterval(async () => {
        try {
            const currentBlock = await provider.getBlockNumber();
            const events = await swapContract.queryFilter(filter, lastBlock + 1, currentBlock);

            for (const event of events) {
                const txid = event.args[0]; // '0x6bf4783...'
                const swapId = event.args[1]; // 2n
                const swapOwner = event.args[2]; // 'tb1qqxqe6f...'
                const toBeReceivedWei = ethers.formatEther(event.args[3]); // 100000000000000n (in wei)

                console.log('VerificationRequested event detected:', {
                    txid,
                    swapId: swapId, // Convert BigInt to string
                    swapOwner,
                    toBeReceived: toBeReceivedWei, // Convert wei to Ether
                });

                try {
                    const cleanedTxid = txid.startsWith('0x') ? txid.slice(2) : txid;
                    const cleanedSwapOwner = swapOwner.startsWith('0x') ? swapOwner.slice(2) : swapOwner;

                    const { isVerified, recipient } = await mockVerifyTransaction(
                        cleanedTxid,
                        cleanedSwapOwner,
                        Number(toBeReceivedWei)
                    );

                    // If verified, call completeVerification on-chain
                    if (isVerified) {
                        console.log('Transaction verified. Recipient:', recipient);
                        const recipientHex = '0x' + recipient; // Add "0x" prefix for EVM compatibility
                        const tx = await swapContract.completeVerification(
                            swapId,
                            isVerified,
                            recipientHex
                        );
                        console.log('completeVerification transaction sent:', tx.hash);
                        await tx.wait();
                        console.log('completeVerification transaction confirmed.');
                    } else {
                        console.log('Transaction not verified.');
                    }
                } catch (error) {
                    console.error('Error processing VerificationRequested event:', error);
                }
            }

            lastBlock = currentBlock;
        } catch (error) {
            console.error('Error polling events:', error);
        }
    }, 5000); // Poll every 5 seconds
}

listenForVerificationRequests();
