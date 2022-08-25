const { ethers, getNamedAccounts, deployments, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");
const chainId = network.config.chainId;

!(chainId == 31337) //bracket is needed outside !, to ensure ! working on the whole equation.
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe;
      let mockV3Aggregator;
      let deployer;
      let sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("constructor", function () {
        it("set the proper priceFeed address", async function () {
          const response = await fundMe.getPriceFeed();
          assert.equal(mockV3Aggregator.address, response);
        });
      });

      describe("fund", function () {
        it("require sending enough ether", async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
        it("donator's address properly updated", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(sendValue.toString(), response.toString());
        });
        it("funders array properly updated", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getFunder(0);
          assert.equal(response, deployer);
        });
      });

      describe("withdraw", function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });
        it("deployer withdral all the funds", async function () {
          const startingFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endDeployerBalance = await fundMe.provider.getBalance(deployer);
          assert.equal(
            startingFundBalance.add(startingDeployerBalance).toString,
            endDeployerBalance.add(gasCost).toString
          );
        });
        it("multi senders, deployer to withdraw", async function () {
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 7; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const startingFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endDeployerBalance = await fundMe.provider.getBalance(deployer);
          assert.equal(
            startingFundBalance.add(startingDeployerBalance).toString,
            endDeployerBalance.add(gasCost).toString
          );
          await expect(fundMe.getFunder(0)).to.be.reverted;
        });
        it("only deployer can withdraw fund", async function () {
          const accounts = await ethers.getSigners();
          const accountHacker = accounts[1];
          const fundMeConnectedContract = await fundMe.connect(accountHacker);
          await expect(
            fundMeConnectedContract.withdraw()
          ).to.be.revertedWithCustomError(fundMe, "FundMe_NotOwner");
        });
      });

      describe("cheapwithdraw", function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });
        it("deployer withdral all the funds", async function () {
          const startingFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const transactionResponse = await fundMe.cheapwithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endDeployerBalance = await fundMe.provider.getBalance(deployer);
          assert.equal(
            startingFundBalance.add(startingDeployerBalance).toString,
            endDeployerBalance.add(gasCost).toString
          );
        });
        it("multi senders, deployer to withdraw", async function () {
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 7; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const startingFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const transactionResponse = await fundMe.cheapwithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endDeployerBalance = await fundMe.provider.getBalance(deployer);
          assert.equal(
            startingFundBalance.add(startingDeployerBalance).toString,
            endDeployerBalance.add(gasCost).toString
          );
          await expect(fundMe.getFunder(0)).to.be.reverted;
        });
        it("only deployer can withdraw fund", async function () {
          const accounts = await ethers.getSigners();
          const accountHacker = accounts[1];
          const fundMeConnectedContract = await fundMe.connect(accountHacker);
          await expect(
            fundMeConnectedContract.cheapwithdraw()
          ).to.be.revertedWithCustomError(fundMe, "FundMe_NotOwner");
        });
      });
    });
