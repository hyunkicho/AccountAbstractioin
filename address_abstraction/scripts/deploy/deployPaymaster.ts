import { ethers } from "hardhat";
import { Contract } from "ethers";

const EntryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
const AccountFactory = "0x80db4661A8dB53b409Ace7967cb9Ba7B4c616c0f";
const PayMaster = "0x95f8C31f0363565651F164e4260bc88962491142";

async function main() {
  let tokenPayMaster: Contract;
  const TokenPaymaster = await ethers.getContractFactory("TokenPaymaster");
  const symbol = "TT"
  tokenPayMaster = await TokenPaymaster.deploy(AccountFactory, symbol, EntryPointAddress);
  console.log('==tokenPayMaster addr=', tokenPayMaster.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
