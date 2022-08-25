const {
  networkConfig,
  DECIMALS,
  INITIAL_DATA,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
//const ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"];
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId === 31337) {
    log("Deploying Mocks, wait...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_DATA],
    });
    log("Mocks deployed!");
    log("-----------------------------------------");
  }
};
module.exports.tags = ["all", "mocks"];
