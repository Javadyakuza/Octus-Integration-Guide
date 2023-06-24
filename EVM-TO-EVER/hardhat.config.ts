import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    BSC: {
      url: "https://endpoints.omniatech.io/v1/bsc/mainnet/public",
      accounts: [process.env.EOA_PRIVATE_KEY!],
    },
  },
};

export default config;
