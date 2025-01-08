require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();

const { PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.0",
  networks: {
    citreaTestnet: {
      url: "https://rpc.testnet.citrea.xyz",
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};


