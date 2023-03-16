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

  await payMaster.mintTokens(sender, ethers.utils.parseEther('1'))

  // Bundler는 OP를 한번에 모으고 검증해서 보내주는 역할을 한다.
  //검증은 백엔드에서 진행해서 PostOpMode 가 0 즉 opSucceeded가 되면 실행
  // TODO 실행시킬꺼 callData로 만들기
  // maxCost가져와서 실행
  //postOp는 entrypoint에서만 실행
  //entryPoint의 _handlePostOp에서 실행 그건 또 _executeUserOp에서 실행 그건 결국 handleOps또는 handleAggregatedOps에서 실행
  //

  const userOperationExample = {
    sender: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    nonce: '0x0000000000000000000000000000000000000000',
    initCode: '0x',
    callData: '0x',
    callGasLimit: 0,
    verificationGasLimit: 100000,
    preVerificationGas: 21000,
    maxFeePerGas: 1541441108,
    maxPriorityFeePerGas: 1000000000,
    paymasterAndData: '0x',
    signature: '0x'
  }

  await payMaster.postOp(0, )

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//https://coinsbench.com/how-to-sign-and-validate-the-signature-of-useroperation-in-eip-4337-account-abstraction-89538e2ffe86