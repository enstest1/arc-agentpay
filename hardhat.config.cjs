require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY || undefined;
module.exports = {
  solidity: { version: "0.8.24", settings: { optimizer: { enabled: true, runs: 200 } } },
  networks: {
    arcMainnet: { url: "https://rpc.mainnet.arc.io", chainId: 5042, accounts: privateKey ? [privateKey] : [] },
    arcTestnet: { url: "https://rpc.testnet.arc.io", chainId: 5042002, accounts: privateKey ? [privateKey] : [] },
  },
};
