import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Transaction, Address } from "locklift";
import { EverAbi } from "../../abi/WEVERVault";
import { buildWrapPayload } from "../helpers/buildWrapPayload";
import * as constants from "../../constants";
import { buildSaveWithdraw } from "../helpers/buildSaveWithdrawPayload";
import { FactorySource } from "../../build/factorySource";
import { getSignatures } from "../helpers/getSignatures";
// import { deriveEverEvmAlienEventAddress } from "../helpers/deriveEverEvmEventAddress";
import { fetchNativeEventAddressFromOriginTxHash } from "../helpers/deriveEventAddressFromOriginHash";
/**
 * this module performs transferring an ever native, evm alien token from everscale network to an evm network using transferEverNativeCoin function.
 * EVER is used as token and receiver evm network is BSC at this particular example.
 * @notice releasing assets on evm network is done manually by calling saveWithdrawAlien on MV contract at BSC.
 * @returns ContractTransactionResponse returned data about the tx
 */
async function transferEverNativeCoin(): Promise<[string, string[]] | unknown> {
  // setting ever wallet
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;
  const everWallet: EVER.EverWalletAccount = await EVER.EverWalletAccount.fromPubkey({
    publicKey: signer.publicKey,
    workchain: 0,
  });
  console.log("ever wallet address : ", await everWallet.address.toString());
  // fetching the contracts
  const WEVERVaultContract: Contract<typeof EverAbi.WeverVault> = await new locklift.provider.Contract(
    EverAbi.WeverVault,
    constants.WEVERVault,
  );
  // getting the payload
  const EverTransferAmount: number = 0.1;
  const wrapPayload: [string, string] = await buildWrapPayload(
    everWallet.address,
    constants.EvmReceiver,
    EverTransferAmount,
    "56",
    false,
  );
  // wrapping
  try {
    const res: Transaction = await WEVERVaultContract.methods
      .wrap({
        tokens: locklift.utils.toNano(EverTransferAmount),
        owner_address: constants.Compounder,
        gas_back_address: everWallet.address,
        payload: wrapPayload[0],
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
    console.log("an error accrued while wrapping : ", e);
    return e;
  }
}

transferEverNativeCoin()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
