// MultiVaultFacetDeposit json
const { ethers, BigNumber } = require("hardhat");
require("dotenv").config();

async function TransferEVMeverAlienToken() {
  // setting the signer
  const evmSigner = await ethers.provider.getSigner(0);
  console.log("user wallet address : ", evmSigner.address);
  // getting the contracts
  let MultiVault = await ethers.getContractFactory("MultiVault");
  let AlienToken = await ethers.getContractFactory("ERC20");
  // attaching them to on-chain addresses
  MultiVault = await MultiVault.attach(
    "0x54c55369a6900731d22eacb0df7c0253cf19dfff"
  );
  AlienToken = AlienToken.attach("0x55d398326f99059ff775485246999027b3197955");
  // approving the MultiVault contract
  // await AlienToken.approve(
  //   await MultiVault.getAddress(),
  //   ethers.parseEther("0.1")
  // );
  // confirming that the contract is approved fro desired amount
  console.log(
    "this is the multiVault allowance : ",
    await AlienToken.allowance(evmSigner.address, await MultiVault.getAddress())
  );
  // deposititng
  const MultiVaultDeposit =
    MultiVault.connect(evmSigner)[
      "deposit(((int8,uint256),address,uint256,uint256,bytes))"
    ];

  const amount = ethers.parseEther("0.1");

  const recipient = {
    wid: "0",
    addr: "0x346c638fe811bcf448d9070116bfa356aa90b4b55567c8810e52ad2a72ff274e",
  };

  const deposit_value = ethers.parseEther("0.0017");
  const deposit_expected_evers = 5000000000;
  const deposit_payload = "0x";

  await MultiVaultDeposit(
    [
      recipient,
      await AlienToken.getAddress(),
      amount,
      deposit_expected_evers,
      deposit_payload,
    ],
    { value: deposit_value }
  ).then((res) => {
    console.log("this is the res ", res);
  });
}
TransferEVMeverAlienToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
