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
// const AccountCreated = "0x0791f62B21783175126d5fd7B8ea10A55F497e4e"; //createAccount에서 나온것
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
  const getAddrss = await accountFactory.getAddress(sender.address, 0)
  const transferCalldata = erc20Token.interface.encodeFunctionData("transfer", [beneficiary.address, changeToBigInt(100)]);
  await payMaster.mintTokens(sender.address, ethers.utils.parseEther('1'))

  console.log("transferCalldata :", transferCalldata)

  function getAccountInitCode () {
    return hexConcat([ //hexConcat은 hex형태로 concat하도록 도와주는 함수 이더스의 라이브러리에 있다.
      AccountFactoryAddress,
      accountFactory.interface.encodeFunctionData('createAccount', ['0x0791f62B21783175126d5fd7B8ea10A55F497e4e', 0]) //지갑을 생성할 주소와 salt값이 여기에 해당
    ])
  }

  console.log("getAccountInitCode :", getAccountInitCode())

  //initCode의 경우 다음과 같이 제작 가능
  // helper function to create the initCode to deploy the account, using our account factory.
  // chai.use(solidity);
  // const tokenURI = 'https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/';

  //set Proposal to send token
  let beneficiaryAddress = beneficiary.address;
  console.log("beneficiaryAddress address :", beneficiaryAddress)

  const initEstimate = await ethers.provider.estimateGas({
    from: EntryPointAddress,
    to: exampleERC20Address,
    data: transferCalldata,
    gasLimit: 10e6
  })

  let verificationGasLimit = ethers.BigNumber.from(100000).add(initEstimate)

  const gasEtimated = await ethers.provider.estimateGas({
    from: EntryPointAddress,
    to: sender.address,
    data: transferCalldata
  })

  const block = await ethers.provider.getBlock('latest')
  let maxFeePerGas = block.baseFeePerGas!.add(1e9)

  // initCode 값이 있어서 지갑을 생성하도록 하는 첫번째 User Operation 생성하기
  let userOpFirst : UserOperation = {
    sender : sender.address,
    nonce : 1, //지갑의 nonce와 동일
    initCode : getAccountInitCode(), //처음에 지갑이 생성될 때 initCode가 필요, 이후에는 0x를 넣어서 트랜잭션을 보내면 된다.
    callData : '0x', //실제로 실행시킬 트랜잭션
    callGasLimit : gasEtimated,
    verificationGasLimit,
    preVerificationGas : 210000,
    maxFeePerGas,
    maxPriorityFeePerGas : 1e9,
    paymasterAndData : PayMasterAddress, // entry point에서 _copyUserOpToMemory 를 호출했을때             mUserOp.paymaster = address(bytes20(paymasterAndData[: 20])); 값에서 주소가 나와야 한다.
    signature : '0x'//원하는 서명을 넣으면 된다. TokenPaymaster 예제 에서는 따로 서명이 필요하지는 않다. Paymaster의 _validatePaymasterUserOp 를 체크하면 된다.
  }
  
  console.log("userOpFirst :", userOpFirst)


  // function packUserOp (op: UserOperation): string {
  //   return ethers.utils.defaultAbiCoder.encode([
  //     'address', // sender
  //     'uint256', // nonce
  //     'bytes32', // initCode
  //     'bytes32', // callData
  //     'uint256', // callGasLimit
  //     'uint', // verificationGasLimit
  //     'uint', // preVerificationGas
  //     'uint256', // maxFeePerGas
  //     'uint256', // maxPriorityFeePerGas
  //     'bytes32' // paymasterAndData
  //   ], [
  //     op.sender,
  //     op.nonce,
  //     ethers.utils.keccak256(op.initCode),
  //     ethers.utils.keccak256(op.callData),
  //     op.callGasLimit,
  //     op.verificationGasLimit,
  //     op.preVerificationGas,
  //     op.maxFeePerGas,
  //     op.maxPriorityFeePerGas,
  //     ethers.utils.keccak256(op.paymasterAndData)
  //   ])
  // }
  
  // const packedOp2nd = packUserOp(userOp2nd)

  // console.log("packedOp2nd :", packedOp2nd)


    // Bundler는 OP를 한번에 모으고 검증해서 보내주는 역할을 한다.
  // 검증은 백엔드에서 진행해서 PostOpMode 가 0 즉 opSucceeded가 되면 실행
  // TODO 실행시킬꺼 callData로 만들기
  // maxCost가져와서 실행
  // postOp는 entrypoint에서만 실행
  // entryPoint의 _handlePostOp에서 실행 그건 또 _executeUserOp에서 실행 그건 결국 handleOps또는 handleAggregatedOps에서 실행

  //const postOp = await entryPoint.handleOps([userOpFirst], beneficiary.address, {gasLimit: 1e7}).then(async tx => console.log(tx))
  const simulate = await entryPoint.simulateValidation(userOpFirst, { gasLimit: 5e6 }).catch(e => e.message)
  console.log("simulate >>", simulate);
  // const [tx] = await ethers.provider.getBlock('latest').then(block => block.transactions)
  // await checkForBannedOps(tx, true)


  // const postOp = await entryPoint.handleOps([userOpFirst], beneficiary.address, {gasLimit: 1e7}).then(async tx => console.log(tx))

  // console.log("postOp :", postOp)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//https://coinsbench.com/how-to-sign-and-validate-the-signature-of-useroperation-in-eip-4337-account-abstraction-89538e2ffe86