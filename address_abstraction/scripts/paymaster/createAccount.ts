import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { EntryPoint } from '../../typechain-types/contracts/core/EntryPoint';
import { UserOperation } from '../helper/UserOperation';
import { hexConcat } from "ethers/lib/utils";
import { getUserOpHash } from './+9';

const EntryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
const AccountFactoryAddress = "0x77Bbcdaa4956DdD2C22140220467D36f3C145608";
const PayMasterAddress = "0xFAC1BBd05a4B47774ee0ACFeF7c5408B3Ef20cD6";
const exampleERC20Address = "0x1A14648713B2A41e88892E23561234b9631c15CF";
const decimals = 18;
function changeToBigInt(amount: number) {
  const answerBigint = ethers.utils.parseUnits(amount.toString(), decimals);
  return answerBigint;
}

function callDataCost (data: string): number {
  return ethers.utils.arrayify(data)
    .map(x => x === 0 ? 4 : 16)
    .reduce((sum, x) => sum + x)
}

//만약 시간 제한을 걸고 싶다면 [PayMasterAddress, timeRange] 와 같이 timeRange에 시간을 넣어주면 된다.
// function getPayMaster () {
//   return hexConcat([PayMasterAddress, timeRange]) 
// }

async function main() {
  const AccountFactory = await ethers.getContractFactory("SimpleAccountFactory");
  const accountFactory = await AccountFactory.attach(AccountFactoryAddress);
  const PayMaster = await ethers.getContractFactory("TokenPaymaster");
  const payMaster = await PayMaster.attach(PayMasterAddress);
  const EntryPoint = await ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPoint.attach(EntryPointAddress);
  const accounts = await ethers.getSigners();
  const ERC20 = await ethers.getContractFactory("MyERC20");
  const erc20Token = await ERC20.attach("exampleERC20Address");
  let deployer:SignerWithAddress = accounts[0];
  let sender: SignerWithAddress = accounts[1];
  let beneficiary: SignerWithAddress = accounts[2];
  const accountAddress = await accountFactory.createAccount(sender.address, 0)
  console.log("accountAddress >>", accountAddress);

  const getAddrss = await accountFactory.getAddress(sender.address, 0)
  console.log("getAddrss >>", getAddrss);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//https://coinsbench.com/how-to-sign-and-validate-the-signature-of-useroperation-in-eip-4337-account-abstraction-89538e2ffe86