require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts: './build/contracts',
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.API_LEY]
    }
  }
};