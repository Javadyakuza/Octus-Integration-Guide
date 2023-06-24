import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

require("dotenv").config();

async function TransferEVMeverNativeToken() {
  // setting the signer
  const evmSigner: HardhatEthersSigner = await ethers.provider.getSigner(0);
  console.log("user wallet address : ", evmSigner.address);
  // getting the contracts
  let MultiVault = await ethers.getContractFactory("MultiVault");
  // attaching them to on-chain addresses
  MultiVault = await MultiVault.attach("0x54c55369a6900731d22eacb0df7c0253cf19dfff");

  // deposititng
  const MultiVaultNativeDeposit =
    MultiVault.connect(evmSigner)["depositByNativeToken(((int8,uint256),uint256,uint256,bytes))"];

  const amount = ethers.parseEther("0.00001");

  const recipient = {
    wid: "0",
    addr: "0x346c638fe811bcf448d9070116bfa356aa90b4b55567c8810e52ad2a72ff274e",
  };

  const deposit_value = ethers.parseEther("0.0017");
  const deposit_expected_evers = 5000000000;
  const deposit_payload = "0x";

  await MultiVaultNativeDeposit([recipient, amount, deposit_expected_evers, deposit_payload], {
    value: deposit_value + amount,
  }).then(res => {
    console.log("this is the res ", res);
  });
}
TransferEVMeverNativeToken().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
