import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Transaction, Address } from "locklift";
import { buildTransferPayload } from "../helpers/buildTransferPayload";
import * as constants from "../../constants";
import { FactorySource } from "../../build/factorySource";
import { buildSaveWithdraw } from "../helpers/buildSaveWithdrawPayload";
import { getSignatures } from "../helpers/getSignatures";
// import { deriveEverEvmAlienEventAddress } from "../helpers/deriveEverEvmEventAddress";
import { fetchNativeEventAddressFromOriginTxHash } from "../helpers/deriveEventAddressFromOriginHash";
/**
 * this module performs transferring an ever native, evm alien token from everscale network to an evm network using transferEverNativeToken function.
 * BRIDGE is used as token and receiver evm network is BSC at this particular example.
 * @notice releasing assets on evm network is done automatically by attaching enough ever to tx.{see ../../constants.ts:32}
 * @returns ContractTransactionResponse returned data about the tx
 */
async function transferEverNativeToken(): Promise<[string, string[]] | unknown> {
  // setting ever wallet
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;
  const everWallet: EVER.EverWalletAccount = await EVER.EverWalletAccount.fromPubkey({
    publicKey: signer.publicKey,
    workchain: 0,
  });
  console.log("ever wallet address : ", await everWallet.address.toString());
  // fetching the contracts
  const BRIDGETokenRoot: Contract<FactorySource["TokenRoot"]> = await locklift.factory.getDeployedContract(
    "TokenRoot",
    constants.EVERBRIDGE,
  );
  const AlienTokenWalletUpgradable: Contract<FactorySource["AlienTokenWalletUpgradeable"]> =
    locklift.factory.getDeployedContract(
      "AlienTokenWalletUpgradeable",
      (await BRIDGETokenRoot.methods.walletOf({ answerId: 0, walletOwner: everWallet.address }).call({})).value0,
    );
  // getting the payload
  const BRIDGETransferAmount: number = 0.01;
  const transferPayload: [string, string] = await buildTransferPayload(constants.EvmReceiver, "56");
  console.log(transferPayload[0]);
  // transferring
  try {
    const res: Transaction = await AlienTokenWalletUpgradable.methods
      .transfer({
        amount: locklift.utils.toNano(BRIDGETransferAmount),
        deployWalletValue: "200000000",
        notify: true,
        payload: transferPayload[0],
        recipient: constants.ProxyMultiVaultNativeV_4,
        remainingGasTo: everWallet.address,
      })
      .send({ from: everWallet.address, amount: constants.transfer_fees.EverToEvmManualRelease, bounce: true });
    console.log("successful, tx hash : ", res.id.hash);
    const eventAddress: Address | undefined = await fetchNativeEventAddressFromOriginTxHash(res?.id.hash);
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
    console.log("an error accrued while transferring : ", e);
    return e;
  }
}

transferEverNativeToken()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
