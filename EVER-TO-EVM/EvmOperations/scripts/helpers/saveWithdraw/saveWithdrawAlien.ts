import { ethers } from "hardhat";
import { LogDescription, ContractTransactionResponse, TransactionReceipt, Log } from "ethers/src.ts/ethers";
import * as Contracts from "../../../typechain-types/index";
import { deployedContracts } from "../../../constants";
require("dotenv").config();

export async function saveWithdrawAlien(
  payLoad: string,
  signatures: readonly [string, string][],
): Promise<ContractTransactionResponse | null> {
  // setting the signer
  const evmSigner = await ethers.provider.getSigner(0);
  console.log("user wallet address : ", evmSigner.address);
  // getting the contracts
  let MultiVault: Contracts.MultiVault__factory = await ethers.getContractFactory("MultiVault");
  // attaching them to on-chain addresses
  MultiVault = await MultiVault.attach(deployedContracts.BSCMultiVault);
  // getting the payload
  // const payload = await
  // releasing assets
  MultiVault = await MultiVault.connect(evmSigner);

  try {
    const res = await MultiVault.saveWithdrawAlien(payLoad, signatures);
    console.log("tx hash ; ", res?.hash);
    return res;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}
saveWithdrawAlien()
  .then(res => {
    console.log("succesfull , tx hash : ", res?.hash);
  })
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
