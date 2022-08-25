const { run } = require("hardhat");

async function verify(contractAddress, arg) {
  console.log("verify contract ...");
  //use try{} catch (e) below to differentiate already verified error vs other error
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: arg,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("already verified");
    } else {
      console.log(e);
    }
  }
}

module.exports = { verify };
