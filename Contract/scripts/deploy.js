const hre = require("hardhat");
require("dotenv").config();

async function main() {
    // Retrieve the private key from environment variables
    const { PRIVATE_KEY } = process.env;

    if (!PRIVATE_KEY) {
        throw new Error("Please set your PRIVATE_KEY in a .env file");
    }

    // Get the signer from the wallet
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);
    console.log('Deploying contracts with the account:', await wallet.getAddress());

    // Get the contract to deploy
    const AtomicSwap = await hre.ethers.getContractFactory("AtomicSwap", wallet);

    // Replace with your actual BitcoinClient address
    const bitcoinClientAddress = "0xE37B011FC207DEEb564f5E0a10729896b39Fa5CD"; // e.g., "0x1234..."

    console.log("Deploying AtomicSwap contract...");
    const atomicSwap = await AtomicSwap.deploy(bitcoinClientAddress);

    console.log("Awaiting confirmations...");
    await atomicSwap.waitForDeployment();

    console.log(`AtomicSwap deployed at: ${await atomicSwap.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// address: 0x181A33a656E3457AfF24c679D7Ba35bb3d18f8e0
// command: npx hardhat run scripts/deploy.js --network citreaTestnet