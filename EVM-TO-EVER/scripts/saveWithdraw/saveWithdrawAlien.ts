import { ethers } from "hardhat";
import BigNumber from "bignumber.js";
import { ContractTransactionResponse } from "ethers/src.ts/ethers";
import * as Contracts from "../../typechain-types/index";
import { deployedContracts } from "../../constants";
import {
  SamplePayloadEverAlienEvmAlienToken,
  SampleSignaturesEverAlienEvmAlienToken,
  SamplePayloadEverAlienEvmNativeToken,
  SampleSignaturesEverAlienEvmNativeToken,
} from "./values";
import * as web3 from "web3";

require("dotenv").config();

export async function saveWithdrawAlien(): Promise<ContractTransactionResponse | null> {
  // setting the signer
  const evmSigner = await ethers.provider.getSigner(0);
  console.log("user wallet address : ", evmSigner.address);
  // getting the contracts
  let MultiVault: Contracts.MultiVault__factory = await ethers.getContractFactory("MultiVault");
  // attaching them to on-chain addresses
  MultiVault = await MultiVault.attach(deployedContracts.BSCMultiVault);

  const signatures = SampleSignaturesEverAlienEvmNativeToken.map(sign => {
    const signature = `0x${Buffer.from(sign, "base64").toString("hex")}`;
    const address = web3.eth.accounts.recover(
      web3.utils.sha3(SamplePayloadEverAlienEvmNativeToken as string) as string,
      signature,
    );
    return {
      address,
      order: new BigNumber(address.slice(2).toUpperCase(), 16),
      signature,
    };
  });

  signatures.sort((a, b) => {
    if (a.order.eq(b.order)) {
      return 0;
    }

    if (a.order.gt(b.order)) {
      return 1;
    }

    return -1;
  });
  // releasing assets
  MultiVault = await MultiVault.connect(evmSigner);
  try {
    const res = await MultiVault.saveWithdrawAlien(
      SamplePayloadEverAlienEvmNativeToken,
      signatures.map(({ signature }) => signature),
    );
    console.log("tx hash ; ", res?.hash);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
saveWithdrawAlien()
  .then(res => {
    console.log("successful , tx hash : ", res?.hash);
  })
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
