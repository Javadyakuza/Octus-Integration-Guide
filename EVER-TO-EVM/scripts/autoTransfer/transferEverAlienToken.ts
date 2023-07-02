import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Transaction } from "locklift";
import { ethers } from "hardhat";
import { buildBurnPayloadForEvmAlienToken } from "../helpers/buildBurnPayload";
import * as constants from "../../constants";
import { FactorySource } from "../../build/factorySource";
/**
 * this module performs transferring an ever alien, evm alien token from everscale network to an evm network using transferEverAlienToken function.
 * USDT is used as token and receiver evm network is BSC at this particular example.
 * @notice releasing assets on evm network is done automatically by attaching enough ever to tx.{see ../../constants.ts:32}
 * @returns ContractTransactionResponse returned data about the tx
 */
async function transferEverAlienToken(): Promise<Transaction | unknown> {
  // setting ever wallet
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;
  const everWallet: EVER.EverWalletAccount = await EVER.EverWalletAccount.fromPubkey({
    publicKey: signer.publicKey,
    workchain: 0,
  });
  console.log("ever wallet address : ", await everWallet.address.toString());
  // fetching the contracts
  const USDTTokenRoot: Contract<FactorySource["TokenRoot"]> = await locklift.factory.getDeployedContract(
    "TokenRoot",
    constants.EVERUSDT,
  );
  const AlienTokenWalletUpgradable: Contract<FactorySource["AlienTokenWalletUpgradeable"]> =
    locklift.factory.getDeployedContract(
      "AlienTokenWalletUpgradeable",
      (await USDTTokenRoot.methods.walletOf({ answerId: 0, walletOwner: everWallet.address }).call({})).value0,
    );
  // getting the payload
  const USDTTransferAmount: number = 0.01;
  const burnPayload: [string, string] = await buildBurnPayloadForEvmAlienToken(
    constants.EvmReceiver,
    constants.TargetTokenRootAlienEvmUSDT,
  );
  console.log(burnPayload);
  // burning
  try {
    const res: Transaction = await AlienTokenWalletUpgradable.methods
      .burn({
        amount: ethers.parseUnits(USDTTransferAmount.toString(), 6).toString(),
        callbackTo: constants.MergePool_V4,
        payload: burnPayload[0],
        remainingGasTo: constants.EventCloser,
      })
      .send({ from: everWallet.address, amount: constants.transfer_fees.EverToEvmAutoRelease, bounce: true });

    console.log("successful, tx hash : ", res.id.hash);
    return res;
  } catch (e) {
    console.log("an error accrued while wrapping : ", e);
    return e;
  }
}

transferEverAlienToken()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
