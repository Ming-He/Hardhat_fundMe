const { ethers, getNamedAccounts, deployments, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");
const chainId = network.config.chainId;
chainId == 31337
  ? describe.skip
  : describe("FundMe staging test", function () {
      let fundMe;
      let deployer;
      let sendValue = ethers.utils.parseEther("0.1");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        //await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allow people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        const transactionResponse = await fundMe.withdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        const endContractBalance = await fundMe.provider.getBalance(
          fundMe.address
        );
        console.log(
          endContractBalance.toString() +
            "should equal 0, running assert test..."
        );
        assert.equal(endContractBalance.toString(), "0");
      });
    });
