import { ethers } from "hardhat";
import { Contract } from "ethers";

const EntryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
const AccountFactory = "0x77Bbcdaa4956DdD2C22140220467D36f3C145608";
const PayMaster = "0xFAC1BBd05a4B47774ee0ACFeF7c5408B3Ef20cD6";

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
