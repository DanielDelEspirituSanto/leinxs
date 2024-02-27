import { ethers } from "hardhat";

async function main() {
  const lock = await ethers.deployContract("leinxs", ["0x920D297E2A88444beEc96B32c35F699b7A6B9257"]);

  await lock.waitForDeployment();

  console.log(
    `Token deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});