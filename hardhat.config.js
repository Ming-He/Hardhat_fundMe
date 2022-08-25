const { getUsedIdentifiers } = require("typechain");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

const Rinkeby_URL = process.env.RINKEBY_RPC_URL;
//a lot of times, it is const Rinkeby_URL = process.env.RINKEBY_RPC_URL || "http://eth-rinkeby",
//so if RPC_URL is not specified in dotenv, it would pick the part after || instead of error in hardhat.
const Mainnet_URL = process.env.MAINNET_RPC_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: Rinkeby_URL,
      accounts: [RINKEBY_PRIVATE_KEY], //get it from metamask
      chainId: 4, //find it in chainlist.org
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    mainnet: {
      url: Mainnet_URL,
      accounts: [MAINNET_PRIVATE_KEY],
      chainId: 1,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      { version: "0.8.8" },
      { version: "0.6.6" },
      { version: "0.6.0" },
    ],
  },
  gasReporter: {
    enabled: true, //if not to report gas, then turn it to false
    outputFile: "gas-report.txt",
    noColors: true,
    //currency: "USD",  currency is to enable its report in USD. This require coinmarketcap API key to get price
    //coinmarketcap: API_KEY, //register an account in coinmarketcap to get API
    token: "ETH", //if not deploy to ethereum, but to other network, here token can specify it.
  },
  namedAccounts: {
    deployer: {
      default: 0, // when using default network local, it uses 1st privatekey as account
      1: 0, //when deploying to mainnet, it uses 1st preivatekey as account
      4: 0, //deploying to rinkeby, uses 1st private key
    },
  },
  mocha: {
    timeout: 10000000,
  },
};
