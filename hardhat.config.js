require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts: './build/contracts',
  },
  networks: {
    hardhat: {
      gas: 1000000,
      gasLimit: 1000000,
      allowUnlimitedContractSize: true
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/50afaf64debd4815bc909e2b66de2ce9",
      accounts: ["0xd7b167503b1df67bacb9690ebf7dffd2738310f8bab59139f659624934fc04ab"]
    },
  }
};