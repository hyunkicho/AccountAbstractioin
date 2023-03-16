import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from "ethers";

const EntryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
const AccountFactory = "0x77Bbcdaa4956DdD2C22140220467D36f3C145608";
async function main() {
  let simpleAccountFactory: Contract;
  const SimpleAccountFactory = await ethers.getContractFactory("SimpleAccountFactory");
  simpleAccountFactory = await SimpleAccountFactory.deploy(EntryPointAddress);
  console.log('==SimpleAccountFactory addr=', simpleAccountFactory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
