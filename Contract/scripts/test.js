const {ethers} = require("hardhat");


async function createSwap(atomicSwap, user, amount) {
    await atomicSwap.connect(user).createSwap(
        "0xtb1qqxqe6f08zsjz8j54duhwcfphctwq6qxunjmtpq", //Wallet 2 BTC
        1000,
        {value: amount}
    );
}
async function initiateVerification(atomicSwap, user) {
    await atomicSwap.connect(user).initiateVerification(
        "0x6bf4783ec9f16407ff3e6c471583ed2fd7443350054e0b6903dfc635cf7f786e", //from Wallet 1 BTC to Wallet 2 BTC
        2 //swapId 1
    );
}

async function completeVerification(atomicSwap, user) {
    await atomicSwap.connect(user).completeVerification(1, true, users[3]);
}
async function refund(atomicSwap, user) {
    await atomicSwap.connect(user).refund(1);
}

async function main() {
    const contractFactory = await ethers.getContractFactory("AtomicSwap");
    const atomicSwap = await contractFactory.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    const users = await ethers.getSigners();
    const amount = ethers.parseEther("100");

    await createSwap(atomicSwap, users[1], amount);
    await initiateVerification(atomicSwap, users[2]);
    await atomicSwap.connect(users[8]).getBalance();
    await refund(atomicSwap, users[1]);
}

main().catch(console.error);