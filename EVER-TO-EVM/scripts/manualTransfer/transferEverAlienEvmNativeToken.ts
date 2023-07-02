import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Address, Transaction } from "locklift";
import { ethers } from "hardhat";
import { buildBurnPayloadForEvmNativeToken } from "../helpers/buildBurnPayload";
import { buildSaveWithdraw } from "../helpers/buildSaveWithdrawPayload";
import * as constants from "../../constants";
import { FactorySource } from "../../build/factorySource";
import { getSignatures } from "../helpers/getSignatures";
// import { deriveEverEvmAlienEventAddress } from "../helpers/deriveEverEvmEventAddress";
import { fetchAlienEventAddressFromOriginTxHash } from "../helpers/deriveEventAddressFromOriginHash";
/**
 * this module performs transferring an ever alien, evm native token from everscale network to an evm network using transferEverAlienToken function.
 * WBNB is used as token and receiver evm network is BSC at this particular example.
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

  const WBNBTokenRoot: Contract<FactorySource["TokenRoot"]> = await locklift.factory.getDeployedContract(
    "TokenRoot",
    constants.EVERWBNB,
  );
  const AlienTokenWalletUpgradable: Contract<FactorySource["AlienTokenWalletUpgradeable"]> =
    locklift.factory.getDeployedContract(
      "AlienTokenWalletUpgradeable",
      (await WBNBTokenRoot.methods.walletOf({ answerId: 0, walletOwner: everWallet.address }).call({})).value0,
    );
  // getting the payload
  const WBNBTransferAmount: number = 0.00001;
  const burnPayload: [string, string] = await buildBurnPayloadForEvmNativeToken(constants.EvmReceiver); // first str is payload and second str is randomNonce
  console.log(burnPayload);
  // burning
  try {
    const res: Transaction = await AlienTokenWalletUpgradable.methods
      .burn({
        callbackTo: constants.ProxyMultivaultAlienV_7,
        payload: burnPayload[0],
        remainingGasTo: everWallet.address,
        amount: ethers.parseEther(WBNBTransferAmount.toString()).toString(),
      })
      .send({ from: everWallet.address, amount: constants.transfer_fees.EverToEvmManualRelease, bounce: true });

    console.log("successful, tx hash: ", res?.id.hash);
    // getting the event contract address
    const eventAddress: Address | undefined = await fetchAlienEventAddressFromOriginTxHash(res?.id.hash);
    // getting the event contract address
    // const eventAddress: Address = await deriveEverEvmAlienEventAddress(
    //   deployEventTxHash,
    //   burnPayload[1],
    //   AlienTokenWalletUpgradable.address,
    //   ethers.parseUnits(WBNBTransferAmount.toString(), 18).toString(),
    //   constants.EvmReceiver,
    //   everWallet.address,
    //   constants.EVERWBNB,
    // );
    // loading event contract
    const eventContract: Contract<FactorySource["EverscaleEthereumBaseEvent"]> =
      await locklift.factory.getDeployedContract("EverscaleEthereumBaseEvent", eventAddress!);
    eventContract.events;
    // preparing payload for `saveWithdrawAlien`
    const payload: string = await buildSaveWithdraw(eventAddress!);
    // fetching the signatures for `saveWithdrawAlien`, waiting 10 seconds for event to get confirmed by relayers
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
