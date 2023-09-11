import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from "ethers";
const EntryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
const AccountFactoryAddress = "0x77Bbcdaa4956DdD2C22140220467D36f3C145608";
const PayMasterAddress = "0xFAC1BBd05a4B47774ee0ACFeF7c5408B3Ef20cD6";
const decimals = 18;
function changeToBigInt(amount: number) {
  const answerBigint = ethers.utils.parseUnits(amount.toString(), decimals);
  return answerBigint;
}
async function main() {
  let simpleAccountFactory: Contract;
  const ERC20 = await ethers.getContractFactory("MyERC20");
  const exampleERC20 = await ERC20.deploy();
  await exampleERC20.deployed();
  const accounts = await ethers.getSigners();
  let deployer:SignerWithAddress = accounts[0];
  let sender: SignerWithAddress = accounts[1];
  let beneficiary: SignerWithAddress = accounts[2];
  await exampleERC20.mint(EntryPointAddress, changeToBigInt(1000))
  await exampleERC20.mint(sender.address, changeToBigInt(1000))
  await exampleERC20.mint(deployer.address, changeToBigInt(1000))
  console.log('==exampleERC20 addr=', exampleERC20.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
