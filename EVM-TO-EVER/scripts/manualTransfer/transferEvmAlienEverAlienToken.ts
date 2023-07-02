import { ethers } from "hardhat";
import { ContractTransactionResponse } from "ethers/src.ts/ethers";
import { deployedContracts } from "../../constants";

require("dotenv").config();
/**
 * this module performs transferring an evm alien, ever alien token from an evm network to everscale network using TransferEvmAlienEverAlienToken function.
 * USDT is used as token and sender evm network is BSC at this particular example.
 * @notice event deploying on everscale side is done manually see{../README.md}, because expected_evers is set to zero
 * @returns ContractTransactionResponse returned data about the tx
 */
async function TransferEvmAlienEverAlienToken(): Promise<ContractTransactionResponse | null> {
  // setting the signer
  const evmSigner = await ethers.provider.getSigner(0);
  console.log("user wallet address : ", evmSigner.address);
  // getting the contracts
  let MultiVault = await ethers.getContractFactory("MultiVault");
  let AlienToken = await ethers.getContractFactory("ERC20");
  // attaching them to on-chain addresses
  MultiVault = await MultiVault.attach(deployedContracts.BSCMultiVault);
  AlienToken = AlienToken.attach(deployedContracts.BSCUSDT);
  // approving the MultiVault contract
  await AlienToken.approve(await MultiVault.getAddress(), ethers.parseEther("0.01"));
  // confirming that the contract is approved fro desired amount
  console.log(
    "this is the multiVault allowance : ",
    await AlienToken.allowance(evmSigner.address, await MultiVault.getAddress()),
  );
  // depositing
  const MultiVaultDeposit = MultiVault.connect(evmSigner)["deposit(((int8,uint256),address,uint256,uint256,bytes))"];

  const amount = ethers.parseEther("0.01");

  const recipient = {
    wid: "0",
    addr: deployedContracts.SampleEverReceiverAddress,
  };

  const deposit_value = ethers.parseEther("0.0016");
  const deposit_expected_evers = 0;
  const deposit_payload = "0x";
  try {
    const res = await MultiVaultDeposit(
      [recipient, await AlienToken.getAddress(), amount, deposit_expected_evers, deposit_payload],
      {
        value: deposit_value,
      },
    );
    console.log("successful , tx hash : ", res?.hash);
    return res;
  } catch (error) {
    return null;
  }
}

TransferEvmAlienEverAlienToken()
  .then(res => {
    console.log("successful , tx hash : ", res?.hash);
  })
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
