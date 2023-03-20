import { ethers } from "hardhat";
const AccountOnwer = "0x0791f62B21783175126d5fd7B8ea10A55F497e4e"; //createAccount에서 나온것

async function main() {
    await ethers.provider.getSigner().sendTransaction({ to: AccountOnwer, value: (5*(10**16)).toString() })

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });