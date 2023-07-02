import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Address, Transaction } from "locklift";
import { ethers } from "hardhat";
import { buildBurnPayloadForEvmAlienToken } from "../helpers/buildBurnPayload";
import { buildSaveWithdraw } from "../helpers/buildSaveWithdrawPayload";
import * as constants from "../../constants";
import { FactorySource } from "../../build/factorySource";
import { getSignatures } from "../helpers/getSignatures";
// import { deriveEverEvmAlienEventAddress } from "../helpers/deriveEverEvmEventAddress";
import { fetchAlienEventAddressFromOriginTxHash } from "../helpers/deriveEventAddressFromOriginHash";

/**
 * this module performs transferring an ever alien, evm alien token from everscale network to an evm network using transferEverAlienToken function.
 * USDT is used as token and receiver evm network is BSC at this particular example.
 * @notice releasing assets on evm network is done manually by calling saveWithdrawAlien on MV contract at BSC.
 * @returns ContractTransactionResponse returned data about the tx
 */

async function transferEverAlienToken(): Promise<[string, string[]] | unknown> {
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
  ); // first str is payload and second str is randomNonce

  // burning
  try {
    const res: Transaction = await AlienTokenWalletUpgradable.methods
      .burn({
        amount: ethers.parseUnits(USDTTransferAmount.toString(), 6).toString(),
        callbackTo: constants.MergePool_V4,
        payload: burnPayload[0],
        remainingGasTo: everWallet.address,
      })
      .send({ from: everWallet.address, amount: constants.transfer_fees.EverToEvmManualRelease, bounce: true });

    console.log("successful, tx hash: ", res?.id.hash);
    // getting the event contract address
    const eventAddress: Address | undefined = await fetchAlienEventAddressFromOriginTxHash(res?.id.hash)!;
    // getting the event contract address
    // const eventAddress: Address = await deriveEverEvmAlienEventAddress(
    //   deployEventTxHash,
    //   burnPayload[1],
    //   AlienTokenWalletUpgradable.address,
    //   ethers.parseUnits(USDTTransferAmount.toString(), 18).toString(), // decimals is 18 because the final token at mergePool is an evmToken
    //   constants.EvmReceiver,
    //   everWallet.address,
    //   constants.TargetTokenRootAlienEvmUSDT,
    // );
    // loading event contract
    const eventContract: Contract<FactorySource["EverscaleEthereumBaseEvent"]> =
      await locklift.factory.getDeployedContract("EverscaleEthereumBaseEvent", eventAddress!);
    eventContract.events;
    // preparing payload for `saveWithdrawAlien`
    const payload: string = await buildSaveWithdraw(eventAddress!);
    // fetching the signatures for `saveWithdrawAlien`
    let signatures: string[] = await getSignatures(eventContract);
    console.log([payload, , signatures]);
    // after this step we have get payload and sigs and pass them to the saveWithdrawAlien
    return [payload, , signatures];
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
