import { ethers } from "hardhat";
import { ContractTransactionResponse } from "ethers/src.ts/ethers";
import { deployedContracts } from "../../constants";

require("dotenv").config();
/**
 * this module performs transferring an evm alien, ever native token from an evm network to everscale network using TransferEvmAlienEverNativeToken function.
 * BRIDGE is used as token and sender evm network is BSC at this articular example.
 * @notice event deploying on everscale side is done manually see{../README.md}, because expected_evers is set to zero
 * @returns ContractTransactionResponse returned data about the tx
 */
async function TransferEvmAlienEverNativeToken(): Promise<ContractTransactionResponse | null> {
  // setting the signer
  const evmSigner = await ethers.provider.getSigner(0);
  console.log("user wallet address : ", evmSigner.address);
  // getting the contracts
  let MultiVault = await ethers.getContractFactory("MultiVault");
  let AlienToken = await ethers.getContractFactory("MultiVaultToken");
  // attaching them to on-chain addresses
  MultiVault = await MultiVault.attach(deployedContracts.BSCMultiVault);
  AlienToken = AlienToken.attach(deployedContracts.BSCBRIDGE);
  // approving the MultiVault contract
  await AlienToken.approve(await MultiVault.getAddress(), ethers.parseUnits("0.01", 9));
  // confirming that the contract is approved fro desired amount
  console.log(
    "this is the multiVault allowance : ",
    await AlienToken.allowance(evmSigner.address, await MultiVault.getAddress()),
  );
  // depositing
  const MultiVaultDeposit = MultiVault.connect(evmSigner)["deposit(((int8,uint256),address,uint256,uint256,bytes))"];

  const amount = ethers.parseUnits("0.01", 9);

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
    console.log("tx hash ; ", res?.hash);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
TransferEvmAlienEverNativeToken()
  .then(res => {
    console.log("successful , tx hash : ", res?.hash);
  })
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
