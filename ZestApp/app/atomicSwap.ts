import {ethers} from "ethers";
import contract from "./atomicSwap.json";


const atomicSwapAddress = "0x181A33a656E3457AfF24c679D7Ba35bb3d18f8e0";
const atomicSwapAbi = contract.abi;

async function createSwap(privateKey: string, toBeSent: number, toBeReceived: number, recipientAddress: string) {
    //console.log("Creating swap...");
    const provider = new ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
    const wallet = new ethers.Wallet(privateKey, provider);
    const atomicSwap = new ethers.Contract(atomicSwapAddress, atomicSwapAbi, wallet);
    await atomicSwap.createSwap(
        recipientAddress,
        ethers.parseEther(toBeSent.toString()),
        {value: ethers.parseEther(toBeReceived.toString())}
    );
    //console.log("Swap created!");
}

async function initVerification(privateKey: string, txid: string, swapId: number) {
    console.log("init verify")
    const provider = new ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
    const wallet = new ethers.Wallet(privateKey, provider);
    const atomicSwap = new ethers.Contract(atomicSwapAddress, atomicSwapAbi, wallet);
    await atomicSwap.initiateVerification(
        txid,
        swapId
    );
    console.log("Verification initiated!");
}

async function getSwap(swapId: number) {
    const provider = new ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
    const atomicSwap = new ethers.Contract(atomicSwapAddress, atomicSwapAbi, provider);
    const swap = await atomicSwap.getSwap(swapId);
    console.log(swap);
}

async function getBalance() {
    const provider = new ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
    const atomicSwap = new ethers.Contract(atomicSwapAddress, atomicSwapAbi, provider);
    let balance = await atomicSwap.getBalance();
    balance = ethers.formatEther(balance);
    console.log(balance);
}

async function refund(swapId: number) {
    const provider = new ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
    const atomicSwap = new ethers.Contract(atomicSwapAddress, atomicSwapAbi, provider);
    let balance = await atomicSwap.refund(swapId);
    balance = ethers.formatEther(balance);
    console.log(balance);
}

export {createSwap, getSwap, getBalance, initVerification, refund};