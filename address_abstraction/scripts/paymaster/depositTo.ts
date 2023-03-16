import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { EntryPoint } from '../../typechain-types/contracts/core/EntryPoint';


const EntryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
const AccountFactory = "0x77Bbcdaa4956DdD2C22140220467D36f3C145608";
const PayMasterAddress = "0xFAC1BBd05a4B47774ee0ACFeF7c5408B3Ef20cD6";

async function main() {
  const accounts = await ethers.getSigners();
  let deployer:SignerWithAddress = accounts[0];
  let sender: SignerWithAddress = accounts[1];
  const PayMaster = await ethers.getContractFactory("TokenPaymaster");
  const payMaster = await PayMaster.attach(PayMasterAddress);
  const EntryPoint = await ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPoint.attach(EntryPointAddress);
  await entryPoint.depositTo(PayMasterAddress, { value: ethers.utils.parseEther('0.1') })
  console.log('depositTo entryPoint')
  await payMaster.addStake(1, { value: ethers.utils.parseEther('2') })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
