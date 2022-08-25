const { networkConfig } = require("../helper-hardhat-config");
const { network, deployments } = require("hardhat");
const { verify } = require("../utils/verify");
const chainId = network.config.chainId;

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let ethUsdPriceFeedAddress;
  if (chainId === 31337) {
    const ethUsdPriceFeed = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdPriceFeed.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress], //need to put in priceFeed address here in args
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (chainId == 4 && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, [ethUsdPriceFeedAddress]);
  }

  log("---------------------------------------------");
};
module.exports.tags = ["all", "fundme"];
